const Session = require("../models/Session");
const Availability = require("../models/Availability");
const TutorProfile = require("../models/TutorProfile");
const MilestoneService = require("./milestone.service");
const createNotification = require("../utils/createNotification");

class SessionService {
  async getStudentSessions(studentId, statusFilter) {
    const query = { student: studentId };
    if (statusFilter) query.status = statusFilter;

    const sessions = await Session.find(query)
      .populate("tutor", "name email")
      .populate("slotId")
      .sort({ sessionDate: 1 });

    return {
      count: sessions.length,
      sessions,
    };
  }

  async getTutorSessions(tutorId, statusFilter) {
    const query = { tutor: tutorId };
    if (statusFilter) query.status = statusFilter;

    const sessions = await Session.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .populate("slotId")
      .sort({ sessionDate: 1 });

    return {
      count: sessions.length,
      sessions,
    };
  }

  async completeSession(sessionId, tutorId) {
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    if (session.tutor.toString() !== tutorId) {
      throw new Error("You are not authorized.");
    }

    if (session.status === "Completed") {
      throw new Error("Session is already completed.");
    }

    if (session.status === "Cancelled") {
      throw new Error("Cannot complete a cancelled session.");
    }

    session.status = "Completed";
    await session.save();

    await TutorProfile.findOneAndUpdate(
      { user: tutorId },
      { $inc: { completedSessionsCount: 1 } }
    );

    await createNotification({
      recipient: session.student,
      sender: tutorId,
      title: "Session Completed",
      message: `Your tutoring session for ${session.subject} has been marked as completed. Please leave a review!`,
      type: "session",
      link: "/student/sessions",
    });

    const milestoneService = new MilestoneService();
    await milestoneService.checkAndAwardMilestones(session.student.toString());

    return {
      message: "Session completed successfully.",
      session,
    };
  }

  async cancelSession(sessionId, userId, userRole) {
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    if (session.student.toString() !== userId && session.tutor.toString() !== userId) {
      throw new Error("You are not authorized to cancel this session.");
    }

    if (session.status === "Cancelled") {
      throw new Error("Session is already cancelled.");
    }

    const wasCompleted = session.status === "Completed";

    session.status = "Cancelled";
    await session.save();

    if (session.slotId) {
      await Availability.findOneAndUpdate(
        { _id: session.slotId, status: "booked" },
        {
          status: "available",
          bookedBy: null,
          sessionId: null,
        }
      );
    }

    const otherUser = session.student.toString() === userId ? session.tutor : session.student;
    await createNotification({
      recipient: otherUser,
      sender: userId,
      title: "Session Cancelled",
      message: `The session for ${session.subject} has been cancelled.`,
      type: "session",
      link: userRole === "student" ? "/tutor/sessions" : "/student/sessions",
    });

    return {
      message: "Session cancelled successfully.",
      session,
    };
  }
}

module.exports = new SessionService();
