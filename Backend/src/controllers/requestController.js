const Request = require("../models/Request");
const User = require("../models/User");
const Session = require("../models/Session");

// Student sends tutoring request
const createRequest = async (req, res) => {
  try {

    const studentId = req.user.id;

    const {
      tutorId,
      subject,
      topic,
      preferredDate,
      preferredTime,
    } = req.body;

    // Check whether tutor exists
    const tutor = await User.findById(tutorId);

    if (!tutor || tutor.role !== "tutor") {
      return res.status(404).json({
        message: "Tutor not found.",
      });
    }

    // Check for existing pending request
  const existingRequest = await Request.findOne({
      student: studentId,
      tutor: tutorId,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending request for this tutor.",
      });
  }

    // Create request
    const request = await Request.create({
      student: studentId,
      tutor: tutorId,
      subject,
      topic,
      preferredDate,
      preferredTime,
    });

    res.status(201).json({
      message: "Tutoring request sent successfully.",
      request,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// Tutor views incoming requests
const getTutorRequests = async (req, res) => {
  try {

    const tutorId = req.user.id;

    const requests = await Request.find({
      tutor: tutorId,
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Tutor accepts or rejects a request
const updateRequestStatus = async (req, res) => {
  try {

    const { requestId } = req.params;
    const { status } = req.body;

    // Check valid status
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Accepted or Rejected."
      });
    }

    // Find request
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found."
      });
    }

    // Make sure request belongs to logged-in tutor
    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this request."
      });
    }

    // Prevent updating completed requests
    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "This request has already been processed."
      });
    }

    // Update status
    request.status = status;

    await request.save();

    // Create a session only if accepted
    if (status === "Accepted") {
    
      await Session.create({
        student: request.student,
        tutor: request.tutor,
        request: request._id,
        subject: request.subject,
        topic: request.topic,
        sessionDate: request.preferredDate,
        sessionTime: request.preferredTime,
      });
    
    }

    res.status(200).json({
      message: `Request ${status.toLowerCase()} successfully.`,
      request
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Student views own requests
const getStudentRequests = async (req, res) => {
  try {

    const studentId = req.user.id;

    const requests = await Request.find({
      student: studentId,
    })
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getTutorRequests,
  updateRequestStatus,
  getStudentRequests,
};