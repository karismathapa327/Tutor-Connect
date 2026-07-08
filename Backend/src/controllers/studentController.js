const Request = require("../models/Request");
const Session = require("../models/Session");
const Review = require("../models/Review");

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    const pendingRequests = await Request.countDocuments({
      student: studentId,
      status: "Pending",
    });

    const upcomingSessions = await Session.countDocuments({
      student: studentId,
      status: "Upcoming",
    });

    const completedSessions = await Session.countDocuments({
      student: studentId,
      status: "Completed",
    });

    const reviewsGiven = await Review.countDocuments({
      student: studentId,
    });

    res.status(200).json({
      pendingRequests,
      upcomingSessions,
      completedSessions,
      reviewsGiven,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStudentDashboard,
};