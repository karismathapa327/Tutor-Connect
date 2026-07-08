const express = require("express");
const router = express.Router();

const { createReview,
        getTutorReviews,
 } = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

// Student leaves review
router.post(
  "/",
  protect,
  authorize("student"),
  createReview
);

// Tutor views received reviews
router.get(
  "/tutor",
  protect,
  authorize("tutor"),
  getTutorReviews
);

module.exports = router;