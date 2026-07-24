const Request = require("../models/Request");
const User = require("../models/User");
const Session = require("../models/Session");
const TutorProfile = require("../models/TutorProfile");
const Availability = require("../models/Availability");
const createNotification = require("../utils/createNotification");

class RequestService {
  async createRequest(studentId, requestData) {
    const { tutorId, subject, topic, slotId } = requestData;

    if (!tutorId || !subject || !topic || !slotId) {
      throw new Error("tutorId, subject, topic, and slotId are required.");
    }

    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== "tutor") {
      throw new Error("Tutor not found.");
    }

    const slot = await Availability.findOne({
      _id: slotId,
      tutor: tutorId,
      status: "available",
    });

    if (!slot) {
      throw new Error("This slot is no longer available. Please select another slot.");
    }

    const bookedSlot = await Availability.findOneAndUpdate(
      { _id: slotId, status: "available" },
      {
        status: "booked",
        bookedBy: studentId,
      },
      { new: true }
    );

    if (!bookedSlot) {
      throw new Error("This slot was just booked by another student. Please select another slot.");
    }

    const request = await Request.create({
      student: studentId,
      tutor: tutorId,
      subject,
      topic,
      slotId: bookedSlot._id,
      preferredDate: bookedSlot.date,
      preferredTime: bookedSlot.startTime,
    });

    const studentUser = await User.findById(studentId);
    await createNotification({
      recipient: tutorId,
      sender: studentId,
      title: "New Tutoring Request",
      message: `${studentUser ? studentUser.name : "A student"} sent a session request for ${subject} on ${new Date(bookedSlot.date).toLocaleDateString("en-US")} at ${bookedSlot.startTime}.`,
      type: "request",
      link: "/tutor/requests",
    });

    const milestoneService = new MilestoneService();
    await milestoneService.checkAndAwardMilestones(studentId);

    return request;
  }

  async getTutorRequests(tutorId) {
    const requests = await Request.find({ tutor: tutorId })
      .populate("student", "name email")
      .populate("slotId")
      .sort({ createdAt: -1 });

    return {
      count: requests.length,
      requests,
    };
  }

  async updateRequestStatus(requestId, tutorId, status) {
    if (!["Accepted", "Rejected"].includes(status)) {
      throw new Error("Status must be Accepted or Rejected.");
    }

    const request = await Request.findById(requestId);
    if (!request) {
      throw new Error("Request not found.");
    }

    if (request.tutor.toString() !== tutorId) {
      throw new Error("You are not authorized to update this request.");
    }

    if (request.status !== "Pending") {
      throw new Error("This request has already been processed.");
    }

    request.status = status;
    await request.save();

    const responseTimeMinutes = Math.max(1, Math.round((Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60)));
    const tutorProfile = await TutorProfile.findOne({ user: tutorId });
    if (tutorProfile) {
      const oldAvg = tutorProfile.avgResponseTimeMinutes || 0;
      const totalResponded = tutorProfile.completedSessionsCount || 0;
      const newAvg = totalResponded > 0 ? Math.round((oldAvg * totalResponded + responseTimeMinutes) / (totalResponded + 1)) : responseTimeMinutes;
      tutorProfile.avgResponseTimeMinutes = newAvg;
      await tutorProfile.save();
    }

    let createdSession = null;
    if (status === "Accepted") {
      const slot = await Availability.findById(request.slotId);
      const sessionDate = slot ? slot.date : request.preferredDate;
      const sessionTime = slot ? slot.startTime : request.preferredTime;

      createdSession = await Session.create({
        student: request.student,
        tutor: request.tutor,
        request: request._id,
        slotId: request.slotId,
        subject: request.subject,
        topic: request.topic,
        sessionDate,
        sessionTime,
      });

      if (slot) {
        slot.sessionId = createdSession._id;
        await slot.save();
      }
    }

    if (status === "Rejected" && request.slotId) {
      await Availability.findOneAndUpdate(
        { _id: request.slotId, status: "booked" },
        {
          status: "available",
          bookedBy: null,
        }
      );
    }

    const tutorUser = await User.findById(tutorId);
    await createNotification({
      recipient: request.student,
      sender: tutorId,
      title: `Request ${status}`,
      message: `${tutorUser ? tutorUser.name : "Your tutor"} has ${status.toLowerCase()} your request for ${request.subject}.`,
      type: "request",
      link: "/student/sessions",
    });

    return {
      message: `Request ${status.toLowerCase()} successfully.`,
      request,
      session: createdSession,
    };
  }

  async getStudentRequests(studentId) {
    const requests = await Request.find({ student: studentId })
      .populate("tutor", "name email")
      .populate("slotId")
      .sort({ createdAt: -1 });

    return {
      count: requests.length,
      requests,
    };
  }
}

module.exports = new RequestService();
