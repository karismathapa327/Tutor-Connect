const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ tutor: 1, rating: -1 });
reviewSchema.index({ tutor: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);