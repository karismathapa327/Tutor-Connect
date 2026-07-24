const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "first_session",
        "sessions_5",
        "sessions_10",
        "sessions_25",
        "sessions_50",
        "first_review",
        "reviews_5",
        "first_booking",
        "streak_7",
        "streak_30",
        "subjects_3",
        "verified_session",
      ],
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "Star",
    },
    achievedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

milestoneSchema.index({ student: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Milestone", milestoneSchema);
