const express = require("express");
const router = express.Router();

const { createTutorProfile,
        getTutorProfile,
        updateTutorProfile,
        getAllTutors,
        getTutorById,
      } = require("../controllers/tutorController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

router.get("/", protect, getAllTutors);

// Create Tutor Profile
router.post(
  "/create",
  protect,
  authorize("tutor"),
  createTutorProfile
);

router.get(
  "/profile",
  protect,
  authorize("tutor"),
  getTutorProfile
);

router.put(
    "/profile",
    protect,
    authorize("tutor"),
    updateTutorProfile
);

router.get("/:id", protect, getTutorById);



module.exports = router;