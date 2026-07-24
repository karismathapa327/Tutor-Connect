const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "blocked"],
      default: "available",
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.index({ tutor: 1, date: 1, status: 1 });
availabilitySchema.index({ tutor: 1, date: 1, startTime: 1 });

module.exports = mongoose.model("Availability", availabilitySchema);
