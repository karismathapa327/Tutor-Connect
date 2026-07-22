const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ["PDF", "Document", "Link", "Assignment"],
      default: "PDF",
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

resourceSchema.index({ tutor: 1, subject: 1 });
resourceSchema.index({ subject: 1, createdAt: -1 });

module.exports = mongoose.model("Resource", resourceSchema);
