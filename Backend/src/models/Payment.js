const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentMethod: {
      type: String,
      default: "Simulated Wallet",
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ student: 1, status: 1 });
paymentSchema.index({ tutor: 1, status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
