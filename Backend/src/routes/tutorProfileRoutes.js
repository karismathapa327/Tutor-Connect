const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

const {
  getMyTutorProfile,
} = require("../controllers/tutorProfileController");

router.get(
  "/",
  protect,
  authorize("tutor"),
  getMyTutorProfile
);

module.exports = router;