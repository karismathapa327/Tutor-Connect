const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
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
    subject: {
      type: String,
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    totalSessionsCompleted: {
      type: Number,
      default: 1,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({ student: 1, tutor: 1, subject: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
