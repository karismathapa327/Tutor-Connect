const Session = require("../models/Session");

// Student views upcoming sessions
const getStudentSessions = async (req, res) => {
  try {

    const sessions = await Session.find({
      student: req.user.id,
    })
      .populate("tutor", "name email")
      .sort({ sessionDate: 1 });

    res.status(200).json({
      count: sessions.length,
      sessions,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Tutor views upcoming sessions
const getTutorSessions = async (req, res) => {
  try {

    const sessions = await Session.find({
      tutor: req.user.id,
    })
      .populate("student", "name email")
      .sort({ sessionDate: 1 });

    res.status(200).json({
      count: sessions.length,
      sessions,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Tutor marks session as completed
const completeSession = async (req, res) => {
  try {

    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found."
      });
    }

    // Only the assigned tutor can complete it
    if (session.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized."
      });
    }

    if (session.status === "Completed") {
      return res.status(400).json({
        message: "Session is already completed."
      });
    }

    session.status = "Completed";

    await session.save();

    res.status(200).json({
      message: "Session completed successfully.",
      session,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStudentSessions,
  getTutorSessions,
  completeSession,
};