const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const tutorRoutes = require("./src/routes/tutorRoutes");
const requestRoutes = require("./src/routes/requestRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Debug: Check if .env is loaded
console.log("PORT =", process.env.PORT);
console.log("MONGO_URI =", process.env.MONGO_URI);

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use(
  "/api/tutor/dashboard",
  require("./src/routes/tutorDashboardRoutes")
);
app.use(errorHandler);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Online Peer Tutoring API is Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});