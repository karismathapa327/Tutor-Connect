const User = require("../models/User");
const TutorProfile = require("../models/TutorProfile");
const Request = require("../models/Request");
const Session = require("../models/Session");
const Review = require("../models/Review");
const Payment = require("../models/Payment");
const Availability = require("../models/Availability");
const createNotification = require("../utils/createNotification");

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class AdminService {
  async getAllUsers(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (queryParams.search) {
      const search = queryParams.search;
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
      return {
        count: total,
        page,
        limit,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        users,
      };
    }

    return { count: total, users };
  }

  async getAllTutors(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (queryParams.search) {
      const search = queryParams.search;
      query.$or = [
        { qualifications: { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
      ];
    }

    const baseQuery = TutorProfile.find(query)
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    const total = await TutorProfile.countDocuments(query);

    let tutors;
    if (limit > 0) {
      tutors = await baseQuery.skip(skip).limit(limit);
    } else {
      tutors = await baseQuery;
    }

    return {
      count: total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      tutors,
    };
  }

  async getAllSessions(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (queryParams.search) {
      const search = queryParams.search;
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } },
      ];
    }

    const baseQuery = Session.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ sessionDate: -1 });

    const total = await Session.countDocuments(query);

    let sessions;
    if (limit > 0) {
      sessions = await baseQuery.skip(skip).limit(limit);
    } else {
      sessions = await baseQuery;
    }

    return {
      count: total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      sessions,
    };
  }

  async getAllReviews(queryParams) {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 0;
    const skip = (page - 1) * limit;
    const query = {};

    if (queryParams.search) {
      const search = queryParams.search;
      query.$or = [
        { review: { $regex: search, $options: "i" } },
      ];
    }

    const baseQuery = Review.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    let reviews;
    if (limit > 0) {
      reviews = await baseQuery.skip(skip).limit(limit);
    } else {
      reviews = await baseQuery;
    }

    return {
      count: total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      reviews,
    };
  }

  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await user.deleteOne();
    await TutorProfile.deleteOne({ user: userId });

    return { message: "User deleted successfully" };
  }

  async getDashboardStats() {
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

    const payments = await Payment.find({ status: "Paid" });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const subjectStats = await Session.aggregate([
      { $group: { _id: "$subject", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const chartSubjectData = subjectStats.map((item) => ({
      name: item._id || "General",
      sessions: item.count,
    }));

    const chartStatusData = [
      { name: "Upcoming", value: upcomingSessions, fill: "#3B82F6" },
      { name: "Completed", value: completedSessions, fill: "#10B981" },
      { name: "Cancelled", value: cancelledSessions, fill: "#EF4444" },
    ];

    const chartUserRoleData = [
      { name: "Students", value: totalStudents, fill: "#6366F1" },
      { name: "Tutors", value: totalTutors, fill: "#8B5CF6" },
      { name: "Admins", value: totalAdmins, fill: "#F59E0B" },
    ];

    const totalSlots = await Availability.countDocuments();
    const availableSlots = await Availability.countDocuments({ status: "available" });
    const bookedSlots = await Availability.countDocuments({ status: "booked" });
    const blockedSlots = await Availability.countDocuments({ status: "blocked" });
    const slotUtilizationRate = totalSlots > 0 ? Number(((bookedSlots / totalSlots) * 100).toFixed(1)) : 0;

    const monthlyRevenuePipeline = [
      { $match: { status: "Paid" } },
      {
        $group: {
          _id: { $month: { $dateFromString: { dateString: { $toString: "$createdAt" } } } },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ];
    const monthlyRevenueResults = await Payment.aggregate(monthlyRevenuePipeline);
    const monthlyRevenue = monthlyRevenueResults.map((item) => ({
      month: MONTH_NAMES[item._id - 1],
      revenue: item.revenue,
    }));

    const monthlySessionsPipeline = [
      { $group: { _id: { $month: { $dateFromString: { dateString: { $toString: "$sessionDate" } } } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ];
    const monthlySessionsResults = await Session.aggregate(monthlySessionsPipeline);
    const monthlySessions = monthlySessionsResults.map((item) => ({
      month: MONTH_NAMES[item._id - 1],
      sessions: item.count,
    }));

    const tutorPerformancePipeline = [
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: "$tutor",
          completedSessions: { $sum: 1 },
          totalStudents: { $addToSet: "$student" },
        },
      },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "tutor" } },
      { $unwind: "$tutor" },
      {
        $project: {
          tutorName: { $concat: ["$tutor.name", " (ID: ", { $toString: "$_id" }, ")"] },
          completedSessions: 1,
          uniqueStudents: { $size: "$totalStudents" },
        },
      },
      { $sort: { completedSessions: -1 } },
      { $limit: 5 },
    ];
    const tutorPerformanceResults = await Session.aggregate(tutorPerformancePipeline);
    const tutorPerformance = tutorPerformanceResults.map((item) => ({
      name: item.tutorName,
      sessions: item.completedSessions,
      students: item.uniqueStudents,
    }));

    const cancellationTrendPipeline = [
      { $match: { status: "Cancelled" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: { $dateFromString: { dateString: { $toString: "$createdAt" } } } } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ];
    const cancellationTrendResults = await Session.aggregate(cancellationTrendPipeline);
    const cancellationTrend = cancellationTrendResults.map((item) => ({
      date: item._id,
      cancellations: item.count,
    }));

    const peakBookingHoursPipeline = [
      { $match: { status: "Accepted" } },
      {
        $group: {
          _id: { $hour: { $dateFromString: { dateString: { $toString: "$preferredDate" }, format: "%Y-%m-%dT%H:%M:%S.%LZ" } } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 24 },
    ];
    const peakBookingHoursResults = await Session.aggregate(peakBookingHoursPipeline);
    const peakBookingHours = peakBookingHoursResults.map((item) => ({
      hour: `${item._id}:00`,
      bookings: item.count,
    }));

    return {
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
      totalSlots,
      availableSlots,
      bookedSlots,
      blockedSlots,
      slotUtilizationRate,
      monthlyRevenue,
      monthlySessions,
      tutorPerformance,
      cancellationTrend,
      peakBookingHours,
    };
  }

  async getPendingVerifications() {
    const tutors = await TutorProfile.find({ verificationStatus: "Pending" })
      .populate("user", "name email role createdAt")
      .sort({ updatedAt: -1 });

    return { count: tutors.length, tutors };
  }

  async updateVerificationStatus(profileId, status, note) {
    if (!["Approved", "Rejected"].includes(status)) {
      throw new Error("Status must be Approved or Rejected.");
    }

    const profile = await TutorProfile.findById(profileId);
    if (!profile) {
      throw new Error("Tutor profile not found.");
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

    return {
      message: `Tutor verification ${status.toLowerCase()} successfully.`,
      profile,
    };
  }
}

module.exports = new AdminService();
