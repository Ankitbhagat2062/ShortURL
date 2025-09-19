import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import urlRoutes from './routes/url.js';
import URL from './models/URL.js';
import authRoutes from './routes/authRoutes.js'; // Adjust path as needed
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = process.env.PORT || 5000;
const MongoDBURL = process.env.MONGODB_URI;

app.set("trust proxy", true);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded" : "Missing");


// ✅ Single CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
].filter(Boolean); // remove undefined

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  }) 
);
app.options("*", cors());


// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(`${MongoDBURL}`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/url', urlRoutes);
app.use('/api/auth', authRoutes);
// app.get('/:shortId', redirectToUrl);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));


// Root route
app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const url = await URL.findOne({ shortId });
  if (!url) return res.status(404).send('Short URL not found');

  const locationPagePath = path.join(__dirname, 'public', 'location.html');
  // add query params to redirect location.html URL
  res.redirect(`/location.html?shortId=${encodeURIComponent(shortId)}&originalUrl=${encodeURIComponent(url.redirectURL)}`);
});


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.get('/',async(req,res)=>{
  res.send('Welcome to URL Shortener API')
})
// Start the server
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
