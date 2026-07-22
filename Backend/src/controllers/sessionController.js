const Session = require("../models/Session");
const createNotification = require("../utils/createNotification");

// Student views sessions
const getStudentSessions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { student: req.user.id };
    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate("tutor", "name email")
      .sort({ sessionDate: 1 });

    res.status(200).json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tutor views sessions
const getTutorSessions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { tutor: req.user.id };
    if (status) query.status = status;

    const sessions = await Session.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ sessionDate: 1 });

    res.status(200).json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tutor marks session as completed
const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required." });
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    if (session.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized." });
    }

    if (session.status === "Completed") {
      return res.status(400).json({ message: "Session is already completed." });
    }

    session.status = "Completed";
    await session.save();

    await createNotification({
      recipient: session.student,
      sender: req.user.id,
      title: "Session Completed",
      message: `Your tutoring session for ${session.subject} has been marked as completed. Please leave a review!`,
      type: "session",
      link: "/student/sessions",
    });

    res.status(200).json({
      message: "Session completed successfully.",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel session (Student or Tutor)
const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const userId = req.user.id;
    if (session.student.toString() !== userId && session.tutor.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to cancel this session." });
    }

    if (session.status === "Cancelled") {
      return res.status(400).json({ message: "Session is already cancelled." });
    }

    session.status = "Cancelled";
    await session.save();

    const otherUser = session.student.toString() === userId ? session.tutor : session.student;
    await createNotification({
      recipient: otherUser,
      sender: userId,
      title: "Session Cancelled",
      message: `The session for ${session.subject} has been cancelled.`,
      type: "session",
      link: req.user.role === "student" ? "/tutor/sessions" : "/student/sessions",
    });

    res.status(200).json({
      message: "Session cancelled successfully.",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentSessions,
  getTutorSessions,
  completeSession,
  cancelSession,
};