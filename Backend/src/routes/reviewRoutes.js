const express = require("express");
const router = express.Router();

const { createReview } = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

// Student leaves review
router.post(
  "/",
  protect,
  authorize("student"),
  createReview
);

module.exports = router;