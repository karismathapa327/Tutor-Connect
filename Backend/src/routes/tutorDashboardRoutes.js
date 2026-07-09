const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

const {
  getTutorDashboard,
} = require("../controllers/tutorDashboardController");

router.get(
  "/",
  protect,
  authorize("tutor"),
  getTutorDashboard
);

module.exports = router;