const express = require("express");
const router = express.Router();

const {
  getStudentSessions,
  getTutorSessions,
  completeSession,
  cancelSession,
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

// Student views sessions
router.get("/student", protect, authorize("student"), getStudentSessions);

// Tutor views sessions
router.get("/tutor", protect, authorize("tutor"), getTutorSessions);

// Complete session
router.put("/:sessionId/complete", protect, authorize("tutor"), completeSession);

// Cancel session
router.put("/:sessionId/cancel", protect, cancelSession);

module.exports = router;