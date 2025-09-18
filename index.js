import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./routes/url.js";
import URL from "./models/URL.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 5000;
const MongoDBURL = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL;

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
mongoose
  .connect(MongoDBURL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/url", urlRoutes);
app.use("/api/auth", authRoutes);

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Redirect short URLs
app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await URL.findOne({ shortId });
    if (!url) return res.status(404).send("Short URL not found");

    res.redirect(
      `/location.html?shortId=${encodeURIComponent(
        shortId
      )}&originalUrl=${encodeURIComponent(url.redirectURL)}`
    );
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).send("Internal server error");
  }
});

// Debug origin
app.use((req, res, next) => {
  console.log("Incoming request from origin:", req.headers.origin);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to URL Shortener API 🚀");
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
