const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

const {
  getStudentDashboard,
  getSuggestedTutors,
} = require("../controllers/studentController");

router.get(
  "/dashboard",
  protect,
  authorize("student"),
  getStudentDashboard
);

router.get(
  "/suggested-tutors",
  protect,
  authorize("student"),
  getSuggestedTutors
);

module.exports = router;