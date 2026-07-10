const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllTutors,
  getDashboardStats,
  getAllSessions,
  getAllReviews,
  deleteUser,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

// Admin views all users
router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.get(
  "/tutors",
  protect,
  authorize("admin"),
  getAllTutors
);

router.get(
  "/statistics",
  protect,
  authorize("admin"),
  getDashboardStats
);

router.get(
  "/sessions",
  protect,
  authorize("admin"),
  getAllSessions
);

router.get(
  "/reviews",
  protect,
  authorize("admin"),
  getAllReviews
);

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);

module.exports = router;