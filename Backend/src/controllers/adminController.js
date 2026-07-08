const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");
const Request = require("../models/Request");
const Session = require("../models/Session");
const Review = require("../models/Review");

// Admin views all users
const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin views all tutor profiles
const getAllTutors = async (req, res) => {
  try {

    const tutors = await TutorProfile.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: tutors.length,
      tutors,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalTutors = await User.countDocuments({
      role: "tutor",
    });

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalTutorProfiles = await TutorProfile.countDocuments();

    const totalRequests = await Request.countDocuments();

    const pendingRequests = await Request.countDocuments({
      status: "Pending",
    });

    const totalSessions = await Session.countDocuments();

    const completedSessions = await Session.countDocuments({
      status: "Completed",
    });

    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalTutors,
      totalAdmins,
      totalTutorProfiles,
      totalRequests,
      pendingRequests,
      totalSessions,
      completedSessions,
      totalReviews,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Admin views all sessions
const getAllSessions = async (req, res) => {
  try {

    const sessions = await Session.find()
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ sessionDate: -1 });

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

// Admin views all reviews
const getAllReviews = async (req, res) => {
  try {

    const reviews = await Review.find()
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}; 

module.exports = {
    getAllUsers,
    getAllTutors,
    getDashboardStats,
    getAllSessions,
    getAllReviews,
}