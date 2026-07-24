const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllTutors,
  getDashboardStats,
  getAllSessions,
  getAllReviews,
  deleteUser,
  getPendingVerifications,
  updateVerificationStatus,
  getSchedulingStats,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.get("/tutors", getAllTutors);
router.get("/statistics", getDashboardStats);
router.get("/scheduling/stats", getSchedulingStats);
router.get("/sessions", getAllSessions);
router.get("/reviews", getAllReviews);
router.delete("/users/:id", deleteUser);

// Verification routes
router.get("/verifications", getPendingVerifications);
router.patch("/verifications/:profileId", updateVerificationStatus);

module.exports = router;