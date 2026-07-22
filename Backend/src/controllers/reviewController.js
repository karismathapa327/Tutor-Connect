const Review = require("../models/Review");
const Session = require("../models/Session");
const TutorProfile = require("../models/TutorProfile");
const createNotification = require("../utils/createNotification");

// Student leaves review
const createReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { sessionId, rating, review } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    if (session.student.toString() !== studentId) {
      return res.status(403).json({ message: "You are not authorized." });
    }

    if (session.status !== "Completed") {
      return res.status(400).json({ message: "You can only review completed sessions." });
    }

    const existingReview = await Review.findOne({ session: sessionId });

    if (existingReview) {
      return res.status(400).json({ message: "Review already submitted." });
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

    res.status(201).json({
      message: "Review submitted successfully.",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tutor views received reviews
const getTutorReviews = async (req, res) => {
  try {
    const tutorId = req.user.id;

    const reviews = await Review.find({ tutor: tutorId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    const tutorProfile = await TutorProfile.findOne({ user: tutorId }).select("averageRating");

    res.status(200).json({
      count: reviews.length,
      averageRating: tutorProfile ? tutorProfile.averageRating : 0,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getTutorReviews,
};