const TutorProfile = require("../models/TutorProfile");
const User = require("../models/User");
const Review = require("../models/Review");
const Request = require("../models/Request");
const Session = require("../models/Session");
const Availability = require("../models/Availability");
const Payment = require("../models/Payment");
const RecommendationService = require("./recommendation.service");
const createNotification = require("../utils/createNotification");

class TutorService {
  async createProfile(userId, profileData) {
    const existing = await TutorProfile.findOne({ user: userId });
    if (existing) {
      throw new Error("Tutor profile already exists.");
    }

    const profile = await TutorProfile.create({
      user: userId,
      bio: profileData.bio,
      qualifications: profileData.qualifications,
      subjects: profileData.subjects,
      experience: profileData.experience,
      hourlyRate: profileData.hourlyRate,
      availability: profileData.availability || [],
    });

    return profile;
  }

  async getMyProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found.");
    }

    const profile = await TutorProfile.findOne({ user: userId });
    if (!profile) {
      throw new Error("Tutor profile not found.");
    }

    const totalReviews = await Review.countDocuments({ tutor: userId });
    const pendingRequests = await Request.countDocuments({ tutor: userId, status: "Pending" });
    const upcomingSessions = await Session.countDocuments({ tutor: userId, status: "Upcoming" });
    const completedSessions = await Session.countDocuments({ tutor: userId, status: "Completed" });

    const qualityScore = this.calculateQualityScore({
      averageRating: profile.averageRating || 0,
      completedSessionsCount: profile.completedSessionsCount || completedSessions,
      totalRequests: (profile.completedSessionsCount || completedSessions),
      verificationStatus: profile.verificationStatus || "Unverified",
    });

    return {
      _id: profile._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberSince: user.createdAt,
      bio: profile.bio,
      qualifications: profile.qualifications,
      subjects: profile.subjects,
      experience: profile.experience,
      hourlyRate: profile.hourlyRate,
      availability: profile.availability,
      averageRating: profile.averageRating,
      verificationStatus: profile.verificationStatus,
      verificationDocs: profile.verificationDocs,
      verificationNote: profile.verificationNote,
      totalReviews,
      pendingRequests,
      upcomingSessions,
      completedSessions,
      reliabilityScore: profile.reliabilityScore || 0,
      avgResponseTimeMinutes: profile.avgResponseTimeMinutes || 0,
      completedSessionsCount: profile.completedSessionsCount || completedSessions,
      qualityScore,
    };
  }

  async updateProfile(userId, profileData) {
    const profile = await TutorProfile.findOne({ user: userId });
    if (!profile) {
      throw new Error("Tutor profile not found.");
    }

    Object.assign(profile, profileData);
    await profile.save();

    return profile;
  }

  async submitVerification(userId, verificationData) {
    const profile = await TutorProfile.findOne({ user: userId });
    if (!profile) {
      throw new Error("Tutor profile not found.");
    }

    const { docType, externalDocUrl } = verificationData;
    let docUrl = externalDocUrl;

    if (verificationData.docFileUrl) {
      docUrl = verificationData.docFileUrl;
    }

    if (!docUrl) {
      throw new Error("Document file or link is required.");
    }

    profile.verificationDocs.push({
      docType,
      docUrl,
      uploadedAt: new Date(),
    });

    if (profile.verificationStatus === "Pending" || !profile.verificationStatus) {
      profile.verificationStatus = "Pending";
    }

    await profile.save();

    return {
      message: "Verification document submitted successfully.",
      profile,
    };
  }

  async getTutorReviews(tutorId) {
    const reviews = await Review.find({ tutor: tutorId })
      .populate("student", "name")
      .sort({ createdAt: -1 });

    const tutorProfile = await TutorProfile.findOne({ user: tutorId }).select("averageRating");

    return {
      count: reviews.length,
      averageRating: tutorProfile ? tutorProfile.averageRating : 0,
      reviews,
    };
  }

  async getTutorDashboard(tutorId) {
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

    const cancelledSessions = await Session.countDocuments({
      tutor: tutorId,
      status: "Cancelled",
    });

    const totalRequests = await Request.countDocuments({ tutor: tutorId });
    const acceptedRequests = await Request.countDocuments({ tutor: tutorId, status: "Accepted" });
    const rejectedRequests = await Request.countDocuments({ tutor: tutorId, status: "Rejected" });

    const profile = await TutorProfile.findOne({ user: tutorId });

    const totalSessions = completedSessions + cancelledSessions;
    const reliabilityScore = this.calculateReliabilityScore({
      averageRating: profile?.averageRating || 0,
      completedSessionsCount: completedSessions,
      avgResponseTimeMinutes: profile?.avgResponseTimeMinutes || 0,
      verificationStatus: profile?.verificationStatus || "Unverified",
      totalRequests: totalRequests,
      completedSessions,
      cancelledSessions,
    });

    const qualityScore = this.calculateQualityScore({
      averageRating: profile?.averageRating || 0,
      completedSessions,
      totalRequests,
      verificationStatus: profile?.verificationStatus || "Unverified",
    });

    const acceptanceRate = totalRequests > 0 ? Number(((acceptedRequests / totalRequests) * 100).toFixed(1)) : 0;

    const payments = await Payment.find({ tutor: tutorId, status: "Paid" });
    const monthlyEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    const recentRequests = await Request.find({ tutor: tutorId })
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

    return {
      pendingRequests,
      upcomingSessions,
      completedSessions,
      cancelledSessions,
      averageRating: profile?.averageRating || 0,
      reliabilityScore,
      qualityScore,
      acceptanceRate,
      monthlyEarnings,
      avgResponseTimeMinutes: profile?.avgResponseTimeMinutes || 0,
      recentRequests,
      upcomingSessionsList,
    };
  }

  calculateReliabilityScore(data) {
    const ratingWeight = 0.4;
    const sessionsWeight = 0.3;
    const responseWeight = 0.2;
    const cancellationWeight = 0.1;

    const ratingScore = data.averageRating ? Math.min(data.averageRating / 5.0, 1.0) : 0.0;

    const totalSessions = data.completedSessionsCount + data.cancelledSessionsCount || 1;
    const sessionScore = data.completedSessionsCount / totalSessions;

    const avgResponse = data.avgResponseTimeMinutes || 0;
    const responseScore = avgResponse > 0 ? Math.max(0, 1 - avgResponse / 120) : 0.5;

    const cancellationRate = data.totalRequests > 0 ? data.cancelledSessionsCount / data.totalRequests : 0;
    const cancellationScore = 1 - cancellationRate;

    const reliability =
      ratingWeight * ratingScore +
      sessionsWeight * sessionScore +
      responseWeight * responseScore +
      cancellationWeight * cancellationScore;

    return Number((reliability * 100).toFixed(1));
  }

  calculateQualityScore(data) {
    const ratingWeight = 0.5;
    const completionWeight = 0.3;
    const verificationWeight = 0.2;

    const ratingScore = data.averageRating ? Math.min(data.averageRating / 5.0, 1.0) : 0.0;

    const totalRequests = data.totalRequests || 1;
    const completionRate = data.completedSessionsCount / totalRequests;

    const verificationScore = data.verificationStatus === "Approved" ? 1.0 : data.verificationStatus === "Pending" ? 0.3 : 0.0;

    const quality =
      ratingWeight * ratingScore +
      completionWeight * completionRate +
      verificationWeight * verificationScore;

    return Number((quality * 100).toFixed(1));
  }

  async getTutorById(tutorId) {
    const tutor = await TutorProfile.findById(tutorId)
      .populate("user", "name email role createdAt");

    if (!tutor) {
      throw new Error("Tutor profile not found.");
    }

    const completedSessionsCount = tutor.completedSessionsCount || await Session.countDocuments({ tutor: tutorId, status: "Completed" });
    const avgResponseTimeMinutes = tutor.avgResponseTimeMinutes || 0;
    const totalRequests = await Request.countDocuments({ tutor: tutorId });

    const scoredTutor = {
      ...tutor.toObject(),
      completedSessionsCount,
      avgResponseTimeMinutes,
    };

    const match = RecommendationService.calculateMatchScore(scoredTutor);
    const reliability = RecommendationService.calculateReliabilityScore(scoredTutor);
    const quality = this.calculateQualityScore({
      averageRating: tutor.averageRating || 0,
      completedSessionsCount,
      totalRequests: totalRequests || completedSessionsCount,
      verificationStatus: tutor.verificationStatus || "Unverified",
    });
    const reason = RecommendationService.generateMatchReason(scoredTutor);

    return {
      ...scoredTutor,
      matchScore: match.totalScore,
      matchBreakdown: match.breakdown,
      reliabilityScore: reliability,
      qualityScore: quality,
      matchReason: reason,
    };
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

    const scoredTutors = tutors.map((tutor) => {
      const completedSessionsCount = tutor.completedSessionsCount || 0;
      const match = RecommendationService.calculateMatchScore(tutor, {
        subject: queryParams.subject,
        maxPrice: queryParams.maxPrice,
        minRating: queryParams.minRating,
        experience: queryParams.experience,
        day: queryParams.day,
      });

      const reliability = RecommendationService.calculateReliabilityScore(tutor);
      const quality = this.calculateQualityScore({
        averageRating: tutor.averageRating || 0,
        completedSessionsCount,
        totalRequests: completedSessionsCount,
        verificationStatus: tutor.verificationStatus || "Unverified",
      });
      const reason = RecommendationService.generateMatchReason(tutor, {
        subject: queryParams.subject,
        maxPrice: queryParams.maxPrice,
        minRating: queryParams.minRating,
        experience: queryParams.experience,
        day: queryParams.day,
      });

      return {
        ...tutor.toObject(),
        matchScore: match.totalScore,
        matchBreakdown: match.breakdown,
        reliabilityScore: reliability,
        qualityScore: quality,
        matchReason: reason,
        avgResponseTimeMinutes: tutor.avgResponseTimeMinutes || 0,
        completedSessionsCount,
      };
    });

    scoredTutors.sort((a, b) => b.matchScore - a.matchScore);

    return {
      count: total,
      page,
      limit,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
      tutors: scoredTutors,
    };
  }

  async getMySlots(tutorId, dateFilter) {
    const availabilityService = require("./availability.service");
    return availabilityService.getTutorSlots(tutorId, dateFilter);
  }

  async createSlot(tutorId, slotData) {
    const availabilityService = require("./availability.service");
    return availabilityService.createSlot(tutorId, slotData);
  }

  async deleteSlot(slotId, tutorId) {
    const availabilityService = require("./availability.service");
    return availabilityService.deleteSlot(slotId, tutorId);
  }

  async getTutorSlotStats(tutorId) {
    const availabilityService = require("./availability.service");
    return availabilityService.getTutorSlotStats(tutorId);
  }
}

module.exports = new TutorService();
