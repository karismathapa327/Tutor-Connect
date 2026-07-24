const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
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
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Availability",
    },

    preferredDate: {
      type: Date,
    },

    preferredTime: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.index({ student: 1, status: 1 });
requestSchema.index({ tutor: 1, status: 1 });

module.exports = mongoose.model("Request", requestSchema);