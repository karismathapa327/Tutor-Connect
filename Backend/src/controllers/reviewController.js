const reviewService = require("../services/review.service");

const createReview = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await reviewService.createReview(studentId, req.body);
    res.status(201).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") || error.message.includes("authorized") || error.message.includes("only") || error.message.includes("already") ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

const getTutorReviews = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await reviewService.getTutorReviews(tutorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getTutorReviews,
};
