const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");
const Request = require("../models/Request");
const Session = require("../models/Session");
const Review = require("../models/Review");
const Payment = require("../models/Payment");
const createNotification = require("../utils/createNotification");

// Admin views all users
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.search) {
      const search = req.query.search;
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const baseQuery = User.find(query).select("-password").sort({ createdAt: -1 });
    const total = await User.countDocuments(query);

    let users;
    if (limit > 0) {
      users = await baseQuery.skip(skip).limit(limit);
    } else {
      users = await baseQuery;
    }

    if (limit > 0) {
      res.status(200).json({
        count: total,
        page,
        limit,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        users,
      });
    } else {
      res.status(200).json({ count: total, users });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin views all tutor profiles
const getAllTutors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.search) {
      const search = req.query.search;
      query.$or = [
        { qualifications: { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
      ];
    }

    const total = await TutorProfile.countDocuments(query);
    const baseQuery = TutorProfile.find(query).populate("user", "name email role").sort({ createdAt: -1 });

    let tutors;
    if (limit > 0) {
      tutors = await baseQuery.skip(skip).limit(limit);
    } else {
      tutors = await baseQuery;
    }

    res.status(200).json({
      count: total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      tutors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin dashboard statistics with Recharts analytics data
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTutors = await User.countDocuments({ role: "tutor" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    const totalTutorProfiles = await TutorProfile.countDocuments();
    const pendingVerificationsCount = await TutorProfile.countDocuments({ verificationStatus: "Pending" });
    const verifiedTutorsCount = await TutorProfile.countDocuments({ verificationStatus: "Approved" });

    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: "Pending" });
    const acceptedRequests = await Request.countDocuments({ status: "Accepted" });
    const rejectedRequests = await Request.countDocuments({ status: "Rejected" });

    const totalSessions = await Session.countDocuments();
    const upcomingSessions = await Session.countDocuments({ status: "Upcoming" });
    const completedSessions = await Session.countDocuments({ status: "Completed" });
    const cancelledSessions = await Session.countDocuments({ status: "Cancelled" });

    const totalReviews = await Review.countDocuments();
    const ratingStats = await Review.aggregate([
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);
    const averageRating = ratingStats.length > 0 ? Number(ratingStats[0].averageRating.toFixed(1)) : 0;

    // Payments / Revenue
    const payments = await Payment.find({ status: "Paid" });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Subject breakdown analytics for Recharts
    const subjectStats = await Session.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const chartSubjectData = subjectStats.map((item) => ({
      name: item._id || "General",
      sessions: item.count,
    }));

    // Status breakdown analytics for Recharts
    const chartStatusData = [
      { name: "Upcoming", value: upcomingSessions, fill: "#3B82F6" },
      { name: "Completed", value: completedSessions, fill: "#10B981" },
      { name: "Cancelled", value: cancelledSessions, fill: "#EF4444" },
    ];

    // User Role Distribution for Recharts
    const chartUserRoleData = [
      { name: "Students", value: totalStudents, fill: "#6366F1" },
      { name: "Tutors", value: totalTutors, fill: "#8B5CF6" },
      { name: "Admins", value: totalAdmins, fill: "#F59E0B" },
    ];

    res.status(200).json({
      totalUsers,
      totalStudents,
      totalTutors,
      totalAdmins,
      totalTutorProfiles,
      pendingVerificationsCount,
      verifiedTutorsCount,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      rejectedRequests,
      totalSessions,
      upcomingSessions,
      completedSessions,
      cancelledSessions,
      totalReviews,
      averageRating,
      totalRevenue,
      chartSubjectData,
      chartStatusData,
      chartUserRoleData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin views all sessions
const getAllSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.search) {
      const search = req.query.search;
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Session.countDocuments(query);
    const baseQuery = Session.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ sessionDate: -1 });

    let sessions;
    if (limit > 0) {
      sessions = await baseQuery.skip(skip).limit(limit);
    } else {
      sessions = await baseQuery;
    }

    res.status(200).json({
      count: total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin views all reviews
const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (req.query.search) {
      const search = req.query.search;
      query.$or = [
        { review: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Review.countDocuments(query);
    const baseQuery = Review.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    let reviews;
    if (limit > 0) {
      reviews = await baseQuery.skip(skip).limit(limit);
    } else {
      reviews = await baseQuery;
    }

    res.status(200).json({
      count: total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin deletes a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    await TutorProfile.deleteOne({ user: req.params.id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tutors pending verification
const getPendingVerifications = async (req, res) => {
  try {
    const tutors = await TutorProfile.find({ verificationStatus: "Pending" })
      .populate("user", "name email role createdAt")
      .sort({ updatedAt: -1 });

    res.status(200).json({ count: tutors.length, tutors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves or rejects tutor verification
const updateVerificationStatus = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { status, note } = req.body; // status: 'Approved' | 'Rejected'

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be Approved or Rejected." });
    }

    const profile = await TutorProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Tutor profile not found." });
    }

    profile.verificationStatus = status;
    if (note) profile.verificationNote = note;
    await profile.save();

    await createNotification({
      recipient: profile.user,
      title: `Account Verification ${status}`,
      message: status === "Approved"
        ? "Congratulations! Your Tutor Account has been verified. A Verified Badge is now displayed on your profile."
        : `Your verification request was rejected. ${note ? "Reason: " + note : ""}`,
      type: "verification",
      link: "/tutor/profile",
    });

    res.status(200).json({
      message: `Tutor verification ${status.toLowerCase()} successfully.`,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllTutors,
  getDashboardStats,
  getAllSessions,
  getAllReviews,
  deleteUser,
  getPendingVerifications,
  updateVerificationStatus,
};