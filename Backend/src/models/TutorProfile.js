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
        date: String,
        startTime: String,
        endTime: String,
        isBooked: {
          type: Boolean,
          default: false,
        },
        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },

    verificationStatus: {
      type: String,
      enum: ["Unverified", "Pending", "Approved", "Rejected"],
      default: "Unverified",
    },

    verificationDocs: [
      {
        docType: { type: String, required: true },
        docUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    verificationNote: {
      type: String,
      default: "",
    },

    reliabilityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    avgResponseTimeMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedSessionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TutorProfile", tutorProfileSchema);