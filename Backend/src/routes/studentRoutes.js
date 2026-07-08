const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

const {
  getStudentDashboard,
} = require("../controllers/studentController");

router.get(
  "/dashboard",
  protect,
  authorize("student"),
  getStudentDashboard
);

module.exports = router;