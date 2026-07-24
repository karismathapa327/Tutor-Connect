const requestService = require("../services/request.service");

const createRequest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await requestService.createRequest(studentId, req.body);
    res.status(201).json({
      message: "Tutoring request sent successfully.",
      request: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTutorRequests = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await requestService.getTutorRequests(tutorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const tutorId = req.user.id;
    const { status } = req.body;

    const result = await requestService.updateRequestStatus(requestId, tutorId, status);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") || error.message.includes("authorized") || error.message.includes("already") ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

const getStudentRequests = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await requestService.getStudentRequests(studentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getTutorRequests,
  updateRequestStatus,
  getStudentRequests,
};
