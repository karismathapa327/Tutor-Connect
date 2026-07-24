const Review = require("../models/Review");
const Session = require("../models/Session");
const TutorProfile = require("../models/TutorProfile");
const createNotification = require("../utils/createNotification");

class ReviewService {
  async createReview(studentId, reviewData) {
    const { sessionId, rating, review } = reviewData;

    const session = await Session.findById(sessionId);
    if (!session) {
      throw new Error("Session not found.");
    }

    if (session.student.toString() !== studentId) {
      throw new Error("You are not authorized.");
    }

    if (session.status !== "Completed") {
      throw new Error("You can only review completed sessions.");
    }

    const existingReview = await Review.findOne({ session: sessionId });
    if (existingReview) {
      throw new Error("Review already submitted.");
    }

    const newReview = await Review.create({
      student: studentId,
      tutor: session.tutor,
      session: sessionId,
      rating,
      review,
    });

    const reviews = await Review.find({ tutor: session.tutor });
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / reviews.length;

    await TutorProfile.findOneAndUpdate(
      { user: session.tutor },
      { averageRating: Number(averageRating.toFixed(2)) }
    );

    await createNotification({
      recipient: session.tutor,
      sender: studentId,
      title: "New Review Received",
      message: `A student left a ${rating}-star review for your session!`,
      type: "review",
      link: "/tutor/subjects",
    });

    return {
      message: "Review submitted successfully.",
      review: newReview,
    };
  }

  async getTutorReviews(tutorId) {
    const reviews = await Review.find({ tutor: tutorId })
      .populate("student", "name")
      .populate("tutor", "name")
      .sort({ createdAt: -1 });

    const tutorProfile = await TutorProfile.findOne({ user: tutorId }).select("averageRating");

    return {
      count: reviews.length,
      averageRating: tutorProfile ? tutorProfile.averageRating : 0,
      reviews,
    };
  }
}

module.exports = new ReviewService();
