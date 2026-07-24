const Request = require("../models/Request");
const Session = require("../models/Session");
const Review = require("../models/Review");
const Milestone = require("../models/Milestone");
const TutorService = require("./tutor.service");

const WEEKDAY_SHORT_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

class DashboardService {
  async getStudentDashboard(studentId) {
    try {
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

      const milestoneCount = await Milestone.countDocuments({
        student: studentId,
      });

      const completedSessionsData = await Session.find({
        student: studentId,
        status: "Completed",
      }).select("sessionTime sessionDate");

      let totalLearningMinutes = 0;
      completedSessionsData.forEach((session) => {
        if (session.sessionTime) {
          const [hours, minutes] = session.sessionTime.split(":").map(Number);
          totalLearningMinutes += (hours || 0) * 60 + (minutes || 0);
        }
      });
      const learningHours = Number((totalLearningMinutes / 60).toFixed(1));

      const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split("T")[0];
        const dayName = WEEKDAY_SHORT_NAMES[d.getDay()];
        const sessionsOnDay = completedSessionsData.filter(
          (s) => new Date(s.sessionDate).toISOString().split("T")[0] === dateStr
        ).length;
        return { day: dayName, sessions: sessionsOnDay };
      });

      const learningStreak = this.calculateLearningStreak(completedSessionsData);

      let recommendedTutors = [];
      try {
        const tutorService = new TutorService();
        const recommendations = await tutorService.getAllTutors({ limit: 6 });
        recommendedTutors = recommendations.tutors || [];
      } catch (recError) {
        console.error("Failed to load recommended tutors:", recError);
      }

      return {
        pendingRequests,
        upcomingSessions,
        completedSessions,
        reviewsGiven,
        milestoneCount,
        learningHours,
        weeklyProgress,
        learningStreak,
        recommendedTutors,
      };
    } catch (error) {
      console.error("Error in getStudentDashboard:", error);
      throw error;
    }
  }

  calculateLearningStreak(completedSessionsData) {
    if (!completedSessionsData || completedSessionsData.length === 0) {
      return 0;
    }

    const uniqueDays = [...new Set(
      completedSessionsData
        .map((s) => new Date(s.sessionDate).toISOString().split("T")[0])
        .filter(Boolean)
        .sort()
    )];

    if (uniqueDays.length === 0) return 0;

    let streak = 1;
    let maxStreak = 1;
    const today = new Date().toISOString().split("T")[0];

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

    if (uniqueDays[uniqueDays.length - 1] !== today && uniqueDays[uniqueDays.length - 2] !== today) {
      return 0;
    }

    return maxStreak;
  }
}

module.exports = new DashboardService();
