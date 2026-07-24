const TutorProfile = require("../models/TutorProfile");
const Session = require("../models/Session");
const Request = require("../models/Request");
const Review = require("../models/Review");
const Availability = require("../models/Availability");

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class RecommendationService {
  async getSuggestedTutors(studentId, filters = {}) {
    const {
      subject,
      maxPrice,
      preferredDate,
      preferredTime,
      minRating,
      experience,
      day,
      limit = 6,
    } = filters;

    let query = {};

    if (subject) {
      query.subjects = { $in: [new RegExp(subject, "i")] };
    }

    if (maxPrice) {
      query.hourlyRate = { $lte: Number(maxPrice) };
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    if (experience) {
      query.experience = { $gte: Number(experience) };
    }

    let tutors = await TutorProfile.find(query)
      .populate("user", "name email role createdAt")
      .sort({ createdAt: -1 });

    const scoredTutors = tutors.map((tutor) => {
      const score = this.calculateMatchScore(tutor, {
        subject,
        maxPrice,
        preferredDate,
        preferredTime,
        minRating,
        experience,
        day,
      });

      const reliabilityScore = this.calculateReliabilityScore(tutor);

      const reason = this.generateMatchReason(tutor, {
        subject,
        maxPrice,
        preferredDate,
        preferredTime,
        minRating,
        experience,
        day,
      });

      return {
        ...tutor.toObject(),
        matchScore: score.totalScore,
        matchBreakdown: score.breakdown,
        reliabilityScore,
        matchReason: reason,
        avgResponseTimeMinutes: tutor.avgResponseTimeMinutes || 0,
        completedSessionsCount: tutor.completedSessionsCount || 0,
      };
    });

    scoredTutors.sort((a, b) => b.matchScore - a.matchScore);

    return {
      count: scoredTutors.length,
      tutors: scoredTutors.slice(0, limit),
    };
  }

  calculateMatchScore(tutor, context = {}) {
    let subjectMatch = 0;
    let ratingScore = 0;
    let availabilityScore = 0;
    let experienceScore = 0;
    let priceScore = 0;

    if (context.subject && tutor.subjects) {
      const matches = tutor.subjects.filter((s) =>
        s.toLowerCase().includes(context.subject.toLowerCase())
      );
      subjectMatch = matches.length > 0 ? 1.0 : 0.0;
    } else if (!context.subject) {
      subjectMatch = 0.7;
    }

    ratingScore = tutor.averageRating ? Math.min(tutor.averageRating / 5.0, 1.0) : 0.0;

    if (context.preferredDate && context.day) {
      const targetDate = new Date(context.preferredDate);
      const dayOfWeek = WEEKDAY_NAMES[targetDate.getDay()];

      if (dayOfWeek === context.day) {
        availabilityScore = 1.0;
      } else {
        availabilityScore = 0.3;
      }
    } else if (context.day) {
      const hasDayMatch = tutor.availability?.some(
        (slot) => slot.day === context.day && !slot.isBooked
      );
      availabilityScore = hasDayMatch ? 0.8 : 0.2;
    } else {
      availabilityScore = 0.5;
    }

    const expYears = Number(tutor.experience) || 0;
    experienceScore = Math.min(expYears / 10, 1.0);

    if (context.maxPrice && tutor.hourlyRate) {
      const max = Number(context.maxPrice);
      const rate = Number(tutor.hourlyRate);
      if (rate <= max) {
        priceScore = 1.0;
      } else {
        priceScore = Math.max(0, 1 - (rate - max) / max);
      }
    } else if (!context.maxPrice) {
      priceScore = 0.6;
    }

    const totalScore =
      0.35 * subjectMatch +
      0.25 * ratingScore +
      0.20 * availabilityScore +
      0.10 * experienceScore +
      0.10 * priceScore;

    return {
      totalScore: Number((totalScore * 100).toFixed(1)),
      breakdown: {
        subjectMatch: Number((subjectMatch * 100).toFixed(1)),
        ratingScore: Number((ratingScore * 100).toFixed(1)),
        availabilityScore: Number((availabilityScore * 100).toFixed(1)),
        experienceScore: Number((experienceScore * 100).toFixed(1)),
        priceScore: Number((priceScore * 100).toFixed(1)),
      },
    };
  }

  calculateReliabilityScore(tutor) {
    let completionRate = 0;
    let responseTimeScore = 0;
    let verificationBonus = 0;

    const totalSessions = tutor.completedSessionsCount || 0;
    const totalRequests = totalSessions;

    if (totalRequests > 0) {
      completionRate = Math.min(totalSessions / totalRequests, 1.0);
    }

    const avgResponse = tutor.avgResponseTimeMinutes || 0;
    const maxExpected = 120;
    responseTimeScore = avgResponse > 0 ? Math.max(0, 1 - avgResponse / maxExpected) : 0.5;

    if (tutor.verificationStatus === "Approved") {
      verificationBonus = 1.0;
    } else if (tutor.verificationStatus === "Pending") {
      verificationBonus = 0.3;
    }

    const reliability =
      0.5 * completionRate +
      0.3 * responseTimeScore +
      0.2 * verificationBonus;

    return Number((reliability * 100).toFixed(1));
  }

  generateMatchReason(tutor, context = {}) {
    const reasons = [];

    if (context.subject && tutor.subjects?.some((s) => s.toLowerCase().includes(context.subject.toLowerCase()))) {
      reasons.push("matches your preferred subject");
    }

    if (context.maxPrice && tutor.hourlyRate && tutor.hourlyRate <= Number(context.maxPrice)) {
      reasons.push("fits your budget");
    }

    if (context.day && tutor.availability?.some((slot) => slot.day === context.day && !slot.isBooked)) {
      reasons.push("has availability on your preferred day");
    }

    if (tutor.averageRating >= 4.5) {
      reasons.push("has an excellent rating");
    }

    if (tutor.experience >= 5) {
      reasons.push("is highly experienced");
    }

    if (tutor.verificationStatus === "Approved") {
      reasons.push("is a verified tutor");
    }

    if (reasons.length === 0) {
      return "This tutor is available on the platform.";
    }

    const lastReason = reasons.pop();
    const reasonString = reasons.length > 0 ? reasons.join(", ") + " and " + lastReason : lastReason;

    return `Recommended because this tutor ${reasonString}.`;
  }
}

module.exports = new RecommendationService();
