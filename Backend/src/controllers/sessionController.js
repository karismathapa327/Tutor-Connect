const sessionService = require("../services/session.service");

const getStudentSessions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { status } = req.query;
    const result = await sessionService.getStudentSessions(studentId, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTutorSessions = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { status } = req.query;
    const result = await sessionService.getTutorSessions(tutorId, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const tutorId = req.user.id;
    const result = await sessionService.completeSession(sessionId, tutorId);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") || error.message.includes("authorized") || error.message.includes("already") ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await sessionService.cancelSession(sessionId, userId, userRole);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") || error.message.includes("authorized") || error.message.includes("already") ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  getStudentSessions,
  getTutorSessions,
  completeSession,
  cancelSession,
};
