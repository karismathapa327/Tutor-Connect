const Milestone = require("../models/Milestone");
const Session = require("../models/Session");
const Review = require("../models/Review");
const Request = require("../models/Request");
const createNotification = require("../utils/createNotification");

const MILESTONE_DEFINITIONS = {
  first_session: {
    label: "First Session",
    description: "Completed your first tutoring session",
    icon: "BookOpen",
  },
  sessions_5: {
    label: "5 Sessions",
    description: "Completed 5 tutoring sessions",
    icon: "Calendar",
  },
  sessions_10: {
    label: "10 Sessions",
    description: "Completed 10 tutoring sessions",
    icon: "Calendar",
  },
  sessions_25: {
    label: "25 Sessions",
    description: "Completed 25 tutoring sessions",
    icon: "Calendar",
  },
  sessions_50: {
    label: "50 Sessions",
    description: "Completed 50 tutoring sessions",
    icon: "Calendar",
  },
  first_review: {
    label: "First Review",
    description: "Left your first tutor review",
    icon: "MessageSquare",
  },
  reviews_5: {
    label: "5 Reviews",
    description: "Left 5 tutor reviews",
    icon: "MessageSquare",
  },
  first_booking: {
    label: "First Booking",
    description: "Made your first session booking",
    icon: "CalendarCheck",
  },
  streak_7: {
    label: "7-Day Streak",
    description: "Maintained a 7-day learning streak",
    icon: "Flame",
  },
  streak_30: {
    label: "30-Day Streak",
    description: "Maintained a 30-day learning streak",
    icon: "Flame",
  },
  subjects_3: {
    label: "Subject Explorer",
    description: "Studied 3 different subjects",
    icon: "BookOpen",
  },
  verified_session: {
    label: "Verified Session",
    description: "Completed a session with a verified tutor",
    icon: "ShieldCheck",
  },
};

class MilestoneService {
  async getMyMilestones(studentId) {
    const milestones = await Milestone.find({ student: studentId }).sort({
      achievedAt: -1,
    });

    const allMilestones = Object.entries(MILESTONE_DEFINITIONS).map(
      ([type, def]) => {
        const achieved = milestones.find((m) => m.type === type);
        return {
          type,
          label: def.label,
          description: def.description,
          icon: def.icon,
          achieved: !!achieved,
          achievedAt: achieved ? achieved.achievedAt : null,
          _id: achieved ? achieved._id : null,
        };
      }
    );

    const achievedCount = milestones.length;

    return {
      count: achievedCount,
      total: Object.keys(MILESTONE_DEFINITIONS).length,
      milestones: allMilestones,
    };
  }

  async checkAndAwardMilestones(studentId) {
    const newlyAchieved = [];

    const completedSessions = await Session.countDocuments({
      student: studentId,
      status: "Completed",
    });

    const reviewsGiven = await Review.countDocuments({ student: studentId });

    const bookings = await Request.countDocuments({ student: studentId });

    const distinctSubjects = await Session.distinct("subject", {
      student: studentId,
      status: "Completed",
    });

    const verifiedTutorSessions = await Session.countDocuments({
      student: studentId,
      status: "Completed",
    }).populate({
      path: "tutor",
      match: { verificationStatus: "Approved" },
    });

    const completedDates = await Session.find({
      student: studentId,
      status: "Completed",
    })
      .sort({ sessionDate: 1 })
      .select("sessionDate");

    const streak = this.calculateStreak(completedDates);

    const checks = [
      { type: "first_session", condition: completedSessions >= 1 },
      { type: "sessions_5", condition: completedSessions >= 5 },
      { type: "sessions_10", condition: completedSessions >= 10 },
      { type: "sessions_25", condition: completedSessions >= 25 },
      { type: "sessions_50", condition: completedSessions >= 50 },
      { type: "first_review", condition: reviewsGiven >= 1 },
      { type: "reviews_5", condition: reviewsGiven >= 5 },
      { type: "first_booking", condition: bookings >= 1 },
      { type: "streak_7", condition: streak >= 7 },
      { type: "streak_30", condition: streak >= 30 },
      { type: "subjects_3", condition: distinctSubjects.length >= 3 },
      { type: "verified_session", condition: verifiedTutorSessions > 0 },
    ];

    for (const check of checks) {
      const existing = await Milestone.findOne({
        student: studentId,
        type: check.type,
      });

      if (!existing && check.condition) {
        const def = MILESTONE_DEFINITIONS[check.type];
        const milestone = await Milestone.create({
          student: studentId,
          type: check.type,
          label: def.label,
          description: def.description,
          icon: def.icon,
          achievedAt: new Date(),
        });

        newlyAchieved.push(milestone);
      }
    }

    for (const milestone of newlyAchieved) {
      await createNotification({
        recipient: studentId,
        title: "Milestone Achieved!",
        message: `Congratulations! You earned the "${milestone.label}" milestone.`,
        type: "system",
        link: "/student/milestones",
      });
    }

    return newlyAchieved;
  }

  calculateStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) return 0;

    const uniqueDays = [...new Set(
      completedDates
        .map((s) => new Date(s.sessionDate).toISOString().split("T")[0])
        .filter(Boolean)
        .sort()
    )];

    if (uniqueDays.length === 0) return 0;

    let streak = 1;
    let maxStreak = 1;

    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1]);
      const curr = new Date(uniqueDays[i]);
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 1;
      }
    }

    return maxStreak;
  }
}

module.exports = new MilestoneService();
