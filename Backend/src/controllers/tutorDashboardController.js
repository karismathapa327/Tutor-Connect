const Request = require("../models/Request");
const Session = require("../models/Session");
const TutorProfile = require("../models/TutorProfile");

const getTutorDashboard = async (req, res) => {
  try {

    const tutorId = req.user.id;

    const pendingRequests = await Request.countDocuments({
      tutor: tutorId,
      status: "Pending",
    });

    const upcomingSessions = await Session.countDocuments({
      tutor: tutorId,
      status: "Upcoming",
    });

    const completedSessions = await Session.countDocuments({
      tutor: tutorId,
      status: "Completed",
    });

    const profile = await TutorProfile.findOne({
      user: tutorId,
    });

    const recentRequests = await Request.find({
      tutor: tutorId,
    })
      .populate("student", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingSessionsList = await Session.find({
      tutor: tutorId,
      status: "Upcoming",
    })
      .populate("student", "name")
      .sort({ sessionDate: 1 })
      .limit(5);

    res.status(200).json({
      pendingRequests,
      upcomingSessions,
      completedSessions,
      averageRating: profile?.averageRating || 0,
      recentRequests,
      upcomingSessionsList,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getTutorDashboard,
};