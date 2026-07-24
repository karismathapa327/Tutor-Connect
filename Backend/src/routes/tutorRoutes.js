const express = require("express");
const router = express.Router();

const {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
  getTutorReviews,
  submitVerification,
} = require("../controllers/tutorController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");
const upload = require("../middleware/uploadMiddleware");

// Public tutor list (with query filtering)
router.get("/", protect, getAllTutors);

// Logged in tutor profile
router.get("/profile", protect, authorize("tutor"), getTutorProfile);
router.get("/reviews", protect, authorize("tutor"), getTutorReviews);

// Profile management
router.post("/create", protect, authorize("tutor"), createTutorProfile);
router.put("/profile", protect, authorize("tutor"), updateTutorProfile);

// Verification upload
router.post("/verify", protect, authorize("tutor"), upload.single("docFile"), submitVerification);

// Availability slots (new slot-based scheduling)
router.use("/", require("./availabilityRoutes"));

// Single tutor detail
router.get("/:id", protect, getTutorById);

module.exports = router;