const Review = require("../models/Review");
const Session = require("../models/Session");
const TutorProfile = require("../models/TutorProfile");

// Student leaves review
const createReview = async (req, res) => {
  try {

    const studentId = req.user.id;

    const {
      sessionId,
      rating,
      review,
    } = req.body;

    // Check session exists
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found.",
      });
    }

    // Session must belong to student
    if (session.student.toString() !== studentId) {
      return res.status(403).json({
        message: "You are not authorized.",
      });
    }

    // Session must be completed
    if (session.status !== "Completed") {
      return res.status(400).json({
        message: "You can only review completed sessions.",
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      session: sessionId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Review already submitted.",
      });
    }

    // Create review
    const newReview = await Review.create({
      student: studentId,
      tutor: session.tutor,
      session: sessionId,
      rating,
      review,
    });

    // Get all reviews for this tutor
    const reviews = await Review.find({
        tutor: session.tutor,
    });

    // Calculate average
    const totalRating = reviews.reduce(
        (sum, item) => sum + item.rating,
        0
    );

    const averageRating = totalRating / reviews.length;

    // Update tutor profile
    await TutorProfile.findOneAndUpdate(
        { user: session.tutor },
        {
            averageRating: Number(averageRating.toFixed(2)),
        }
    );

    res.status(201).json({
      message: "Review submitted successfully.",
      review: newReview,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Tutor views received reviews
const getTutorReviews = async (req, res) => {
  try {

    const tutorId = req.user.id;

    const reviews = await Review.find({
      tutor: tutorId,
    })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    const tutorProfile = await TutorProfile.findOne({
      user: tutorId,
    }).select("averageRating");

    res.status(200).json({
      count: reviews.length,
      averageRating: tutorProfile ? tutorProfile.averageRating : 0,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getTutorReviews,
};