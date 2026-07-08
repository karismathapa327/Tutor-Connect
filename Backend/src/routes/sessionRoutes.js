const express = require("express");
const router = express.Router();

const {
  getStudentSessions,
  getTutorSessions,
  completeSession,
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

// Student views sessions
router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentSessions
);

// Tutor views sessions
router.get(
  "/tutor",
  protect,
  authorize("tutor"),
  getTutorSessions
);

router.put(
    "/:sessionId/complete",
    protect,
    authorize("tutor"),
    completeSession
);

module.exports = router;