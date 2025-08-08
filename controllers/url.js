import URL from '../models/URL.js';
import User from '../models/User.js';
import shortid from 'shortid';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();
const accessKey = process.env.ipstack_ACCESSKEY
// Create a short URL
export const createShortUrl = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { url, userId } = req.body;
        console.log(userId)
        // Validate URL format using URL constructor only
        try {
            const urlObj = new global.URL(url);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return res.status(400).json({ error: 'URL must use http or https protocol' });
            }
        } catch (errors) {
            return res.status(400).json({ error: errors });
        }
        const user = await User.findById(userId);
        if (user === null) {
            // Allow creation without userId but delete after 1 minute
            console.log('User not logged In but created short URL')
            const shortId = shortid.generate();
            const newUrl = await URL.create({
                shortId,
                redirectURL: url,
                userId: null,
                userType: 'Free',
                visitHistory: []
            });
            await newUrl.save({ validateBeforeSave: false });

            // Schedule deletion after 1 minute
            setTimeout(async () => {
                try {
                    await URL.deleteOne({ shortId });
                    console.log(`Deleted short URL with shortId: ${shortId} after 1 minute`);
                } catch (err) {
                    console.error(`Error deleting short URL with shortId: ${shortId}`, err);
                }
            }, 60 * 1000); // 60000 ms = 1 minute

            return res.status(201).json({
                shortUrl: `http://localhost:5000/api/url/${shortId}`,
                shortId,
                originalUrl: url
            });
        }
        else {
            console.log('User logged In and created short URL')
        }

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Check if URL already exists
        const existingUrl = await URL.findOne({ redirectURL: url });
        if (existingUrl) {
            return res.status(200).json({
                shortUrl: `http://localhost:5000/${existingUrl.shortId}`,
                shortId: existingUrl.shortId,
                originalUrl: existingUrl.redirectURL
            });
        }

        // Create new short URL
        const shortId = shortid.generate();
        const newUrl = new URL({
            shortId: shortId,
            redirectURL: url,
            userId: userId,
            userType: 'Premium' // or 'Premium'
        });
        await newUrl.save();


        await newUrl.save({ validateBeforeSave: false });

        // Push the shortId to the user's URLs array
        user.URL = user.URL;
        user.URL.push(newUrl._id);
        await user.save();

        res.status(201).json({
            shortUrl: `http://localhost:5000/${shortId}`,
            shortId,
            originalUrl: url,
            userId: userId,
            userType: 'Premium'
        });
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const redirectToUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        const url = await URL.findOne({ shortId });

        if (!url) return res.status(404).json({ error: 'Short URL not found' });
        // Get client IP address with proper handling for proxies
        let ip = req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.ip ||
            'unknown';

        // Handle multiple IPs in x-forwarded-for (take the first one)
        if (ip && ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }

        // Handle IPv6 mapped IPv4 addresses
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }
        const response = await fetch(`https://api.ipstack.com/${ip}?access_key=${accessKey}`);
        const data = await response.json();

        if (data.error) {
            console.error('Error:', data.error.info || data.error);
            // Set default values if API fails
            const country = 'Unknown';
            const region = 'Unknown';
            const city = 'Unknown';
            const userAgent = req.headers['user-agent'] || '';
            const location = {
                city,
                region,
                country,
            }
            url.visitHistory.push({ timestamp: new Date(), ip, location, userAgent });
        } else {
            console.log('Location data:', data.city, data.region_name, data.country_name);
            const country = data.country_name || 'Unknown';
            const region = data.region_name || 'Unknown';
            const city = data.city || 'Unknown';
            const userAgent = req.headers['user-agent'] || '';
            const location = {
                city,
                region,
                country,
            }
            url.visitHistory.push({ timestamp: new Date(), userAgent, ip, location });
        }
        await url.save();
        return res.redirect(url.redirectURL);
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get URL analytics
export const getAnalytics = async (req, res) => {
    try {
        const { shortId } = req.params;

        const url = await URL.findOne({ shortId });

        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        return res.json({
            shortId: url.shortId,
            originalUrl: url.redirectURL,
            totalClicks: url.visitHistory.length,
            visitHistory: url.visitHistory,
            createdAt: url.createdAt
        });
    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all URLs for a specific user
import mongoose from 'mongoose';

export const getAllUrls = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const urls = await URL.find({
            userId: { $in: [new mongoose.Types.ObjectId(userId)] }
        }).sort({ createdAt: -1 });

        const urlsWithStats = urls.map(url => ({
            shortId: url.shortId,
            originalUrl: url.redirectURL,
            shortUrl: `http://localhost:5000/${url.shortId}`,
            totalClicks: url.visitHistory.length,
            visitHistory: url.visitHistory,
            createdAt: url.createdAt,
            userId: userId
        }));

        res.json(urlsWithStats);
    } catch (error) {
        console.error('Error getting user URLs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const deleteUrls = async (req, res) => {
    try {
        const { userId } = req.body; // Make sure this is in the request body
        const { shortId } = req.params;

        if (!shortId) {
            return res.status(400).json({ error: 'shortId is required' });
        }

        const url = await URL.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Optional: remove from user's list
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                $pull: { URL: url._id },
            });
        }

        await URL.findByIdAndDelete(url._id);

        res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



import fetch from 'node-fetch';

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  const response = await fetch(url, {
    headers: { 'User-Agent': 'YourAppNameHere' }
  });
  const data = await response.json();

  const city = data.address.city || data.address.town || data.address.village || null;
  const region = data.address.state || null;
  const country = data.address.country || null;
  return { city, region, country };
}

export const trackVisit = async (req, res) => {
  console.log('req.body:', req.body); 
  try {
    const { shortId, geoPosition, userAgent } = req.body;

    if (!shortId) {
      return res.status(400).json({ error: 'shortId is required' });
    }

    let ip = req.headers['x-forwarded-for'] ||
             req.headers['x-real-ip'] ||
             req.connection?.remoteAddress ||
             req.socket?.remoteAddress ||
             req.ip ||
             'unknown';

    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    if (ip && ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    const url = await URL.findOne({ shortId });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Call reverseGeocode with await to get city, region, country
    let location = null;
    if (geoPosition && geoPosition.lat && geoPosition.lon) {
      const { city, region, country } = await reverseGeocode(geoPosition.lat, geoPosition.lon);
      location = {
        city,
        region,
        country,
        lat: geoPosition.lat,
        lon: geoPosition.lon
      };
    }

    url.visitHistory.push({
      timestamp: new Date(),
      ip,
      location,
      userAgent: userAgent || 'Unknown'
    });

    await url.save();

    console.log('Visit tracked:', { shortId, ip, location, userAgent });  // For debugging
    res.json({ message: 'Visit tracked successfully' });
  } catch (err) {
    console.error('Error tracking visit:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


