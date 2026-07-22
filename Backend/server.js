const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const tutorRoutes = require("./src/routes/tutorRoutes");
const requestRoutes = require("./src/routes/requestRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const favoriteRoutes = require("./src/routes/favoriteRoutes");
const resourceRoutes = require("./src/routes/resourceRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const certificateRoutes = require("./src/routes/certificateRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn("WARNING: JWT_SECRET is missing or too weak. Set a strong secret in .env.");
}

// Connect Database
connectDB();

const app = express();

// Security Middleware
app.use(helmet());

// CORS - restrict to frontend origin in production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL injection - disabled for Express 5 compatibility
// app.use(mongoSanitize());

// Prevent XSS attacks - disabled for Express 5 compatibility  
// app.use(xss());

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Strict rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later." },
});
app.use("/api/auth", authLimiter);

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/tutor/dashboard", require("./src/routes/tutorDashboardRoutes"));

// New BSc CSIT Upgrade API Routes
app.use("/api/notifications", notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/certificates", certificateRoutes);

app.use(errorHandler);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Online Peer Tutoring API is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
