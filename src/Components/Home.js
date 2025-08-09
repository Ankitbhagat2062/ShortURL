import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || `https://shorturl-production-2c19.up.railway.app`;
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortId, setShortId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = useSelector((state) => state.user.userId);

  const createShortUrl = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Enhanced URL validation
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setError('URL must use http or https protocol');
        return;
      }
    } catch {
      setError('. Please include http:// or https://');
      return;
    }

    setLoading(true);
    setError('');
    setShortUrl('');
    setShortId('');
    setAnalytics(null);

    try {
      if (userId) {
        const response = await axios.post(`${BASE_URL}/api/url/shorten`, {
          url: url.trim(),
          userId: userId,
        });
        setShortUrl(response.data.shortUrl);
        setShortId(response.data.shortId);
        setUrl('');
        if (response.ok) {
          toast('Successfully Created Short URL');
        }
      }
      else {
        setUser("")
        const response = await axios.post(`${BASE_URL}/api/url/shorten`, {
          url: url.trim(),
          userId: User,
        });
        setShortUrl(response.data.shortUrl);
        setShortId(response.data.shortId);
        setUrl('');
        if (response.ok) {
          toast('This Short URL will be deleted within 5 minutes.Please Sign up for permanent URL');
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error creating short URL');
    } finally {
      setLoading(false);
    }
  };
  const getAnalytics = async () => {
    if (!shortId) {
      setError('Please create a short URL first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${BASE_URL}/api/url/analytics/${shortId}`);
      setAnalytics(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="App">
      <ToastContainer />
      <h1>URL Shortener</h1>
      <main className="main-content">
        <section className="url-form-section">
          <h2>Create Short URL</h2>

          <div className="form-group">
            <input
              type="url"
              placeholder="Enter your long URL here"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="url-input"
            />
          </div>

          <button
            onClick={createShortUrl}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>

          {error && <p className="error">{error}</p>}

          {shortUrl && (
            <div className="result-box">
              <h3>Short URL Created!</h3>
              <p>
                <strong>Short URL:</strong>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-url"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  style={{
                    marginLeft: '10px',
                    padding: '5px 10px',
                    fontSize: '12px',
                  }}
                >
                  Copy
                </button>
              </p>
              <p>
                <strong>Short ID:</strong> {shortId}
              </p>
            </div>
          )}
        </section>

        {shortId && (
          <section className="analytics-section">
            <h2>Analytics Dashboard</h2>

            <button onClick={getAnalytics} disabled={loading} className="btn btn-success">
              {loading ? 'Loading...' : 'Get Analytics'}
            </button>

            {analytics && (
              <div className="analytics-box">
                <h3>Analytics for {analytics.shortId}</h3>
                <p>
                  <strong>Original URL:</strong> {analytics.originalUrl}
                </p>
                <p>
                  <strong>Total Clicks:</strong> {analytics.totalClicks}
                </p>
                <p>
                  <strong>Created At:</strong>{' '}
                  {new Date(analytics.createdAt).toLocaleString()}
                </p>

                {analytics.visitHistory.length > 0 && (
                  <div>
                    <h4>Recent Clicks:</h4>
                    <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {analytics.visitHistory.slice(-5).map((visit, index) => (
                        <li key={index}>
                          {new Date(visit.timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};


export default Home
