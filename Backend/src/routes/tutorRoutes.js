const express = require("express");
const router = express.Router();

const {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
} = require("../controllers/tutorController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

// Public tutor list
router.get("/", protect, getAllTutors);

// Logged in tutor profile
router.get(
  "/profile",
  protect,
  authorize("tutor"),
  getTutorProfile
);

// Create profile
router.post(
  "/create",
  protect,
  authorize("tutor"),
  createTutorProfile
);

// Update profile
router.put(
  "/profile",
  protect,
  authorize("tutor"),
  updateTutorProfile
);

// Single tutor
router.get(
  "/:id",
  protect,
  getTutorById
);

module.exports = router;