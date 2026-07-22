const Request = require("../models/Request");
const User = require("../models/User");
const Session = require("../models/Session");
const TutorProfile = require("../models/TutorProfile");
const createNotification = require("../utils/createNotification");

// Student sends tutoring request
const createRequest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { tutorId, subject, topic, preferredDate, preferredTime, slotId } = req.body;

    if (!tutorId || !subject || !topic || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: "tutorId, subject, topic, preferredDate, and preferredTime are required." });
    }

    if (new Date(preferredDate) < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({ message: "Preferred date must be today or a future date." });
    }

    const tutor = await User.findById(tutorId);

    if (!tutor || tutor.role !== "tutor") {
      return res.status(404).json({ message: "Tutor not found." });
    }

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

    const request = await Request.create({
      student: studentId,
      tutor: tutorId,
      subject,
      topic,
      preferredDate,
      preferredTime,
    });

    const studentUser = await User.findById(studentId);
    await createNotification({
      recipient: tutorId,
      sender: studentId,
      title: "New Tutoring Request",
      message: `${studentUser ? studentUser.name : "A student"} sent a session request for ${subject}.`,
      type: "request",
      link: "/tutor/requests",
    });

    res.status(201).json({
      message: "Tutoring request sent successfully.",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tutor views incoming requests
const getTutorRequests = async (req, res) => {
  try {
    const tutorId = req.user.id;

    const requests = await Request.find({ tutor: tutorId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tutor accepts or rejects a request
const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Accepted or Rejected." });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this request." });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ message: "This request has already been processed." });
    }

    request.status = status;
    await request.save();

    let createdSession = null;
    if (status === "Accepted") {
      createdSession = await Session.create({
        student: request.student,
        tutor: request.tutor,
        request: request._id,
        subject: request.subject,
        topic: request.topic,
        sessionDate: request.preferredDate,
        sessionTime: request.preferredTime,
      });

      // Mark slot booked if matching availability slot exists
      const profile = await TutorProfile.findOne({ user: request.tutor });
      if (profile && profile.availability && profile.availability.length > 0) {
        const slot = profile.availability.find(
          (s) => s.startTime === request.preferredTime && !s.isBooked
        );
        if (slot) {
          slot.isBooked = true;
          slot.bookedBy = request.student;
          await profile.save();
        }
      }
    }

    const tutorUser = await User.findById(req.user.id);
    await createNotification({
      recipient: request.student,
      sender: req.user.id,
      title: `Request ${status}`,
      message: `${tutorUser ? tutorUser.name : "Your tutor"} has ${status.toLowerCase()} your request for ${request.subject}.`,
      type: "request",
      link: "/student/sessions",
    });

    res.status(200).json({
      message: `Request ${status.toLowerCase()} successfully.`,
      request,
      session: createdSession,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student views own requests
const getStudentRequests = async (req, res) => {
  try {
    const studentId = req.user.id;

    const requests = await Request.find({ student: studentId })
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
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