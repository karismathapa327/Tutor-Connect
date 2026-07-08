const mongoose = require("mongoose");

const tutorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    qualifications: {
      type: String,
      required: true,
    },

    subjects: [
      {
        type: String,
      },
    ],

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },

    availability: [
      {
        day: String,
        startTime: String,
        endTime: String,
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TutorProfile", tutorProfileSchema);