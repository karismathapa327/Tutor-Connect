const express = require("express");
const router = express.Router();

const {
  getTutorSlots,
  createSlot,
  deleteSlot,
  getAvailableSlots,
  blockSlot,
  unblockSlot,
  getTutorSlotStats,
} = require("../controllers/availabilityController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

router.use(protect);

router.get("/:tutorId/slots", getTutorSlots);
router.get("/:tutorId/slots/available", getAvailableSlots);
router.post("/slots", authorize("tutor"), createSlot);
router.delete("/slots/:id", authorize("tutor"), deleteSlot);
router.patch("/slots/:id/block", authorize("tutor"), blockSlot);
router.patch("/slots/:id/unblock", authorize("tutor"), unblockSlot);
router.get("/slots/stats", authorize("tutor"), getTutorSlotStats);

module.exports = router;
