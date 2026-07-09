const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");
const Request = require("../models/Request");
const Session = require("../models/Session");
const Review = require("../models/Review");

const getMyTutorProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    // Get user information
    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Get tutor profile
    const profile = await TutorProfile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Tutor profile not found.",
      });
    }

    // Statistics
    const totalReviews = await Review.countDocuments({
      tutor: userId,
    });

    const pendingRequests = await Request.countDocuments({
      tutor: userId,
      status: "Pending",
    });

    const upcomingSessions = await Session.countDocuments({
      tutor: userId,
      status: "Upcoming",
    });

    const completedSessions = await Session.countDocuments({
      tutor: userId,
      status: "Completed",
    });

    res.status(200).json({

      // Personal Information
      name: user.name,
      email: user.email,
      role: user.role,
      memberSince: user.createdAt,

      // Professional Information
      bio: profile.bio,
      qualifications: profile.qualifications,
      subjects: profile.subjects,
      experience: profile.experience,
      hourlyRate: profile.hourlyRate,
      availability: profile.availability,

      // Statistics
      averageRating: profile.averageRating,
      totalReviews,
      pendingRequests,
      upcomingSessions,
      completedSessions,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getMyTutorProfile,
};