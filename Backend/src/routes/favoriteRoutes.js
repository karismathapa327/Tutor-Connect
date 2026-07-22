const express = require("express");
const router = express.Router();

const {
  toggleFavorite,
  getFavoriteTutors,
  getFavoriteIds,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

router.use(protect, authorize("student"));

router.get("/", getFavoriteTutors);
router.get("/ids", getFavoriteIds);
router.post("/:tutorId", toggleFavorite);

module.exports = router;
