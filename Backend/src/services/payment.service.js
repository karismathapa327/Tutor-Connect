const Payment = require("../models/Payment");
const createNotification = require("../utils/createNotification");

class PaymentService {
  async processPayment(studentId, paymentData) {
    const { tutorId, sessionId, amount, paymentMethod } = paymentData;

    if (!tutorId) {
      throw new Error("tutorId is required.");
    }

    if (amount === undefined || amount === null || Number(amount) <= 0) {
      throw new Error("A valid amount is required.");
    }

    const transactionId = `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const payment = await Payment.create({
      student: studentId,
      tutor: tutorId,
      session: sessionId || null,
      amount: Number(amount),
      status: "Paid",
      transactionId,
      paymentMethod: paymentMethod || "Simulated Card / e-Wallet",
    });

    await createNotification({
      recipient: tutorId,
      sender: studentId,
      title: "Payment Received",
      message: `Received simulated payment of Rs. ${amount} (TXN: ${transactionId}).`,
      type: "payment",
    });

    return {
      message: "Payment processed successfully.",
      payment,
    };
  }

  async getMyPayments(userId, userRole) {
    let query = {};
    if (userRole === "student") {
      query.student = userId;
    } else if (userRole === "tutor") {
      query.tutor = userId;
    }

    const payments = await Payment.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .populate("session")
      .sort({ createdAt: -1 });

    const totalAmount = payments.reduce((sum, p) => sum + (p.status === "Paid" ? p.amount : 0), 0);

    return {
      count: payments.length,
      totalAmount,
      payments,
    };
  }

  async getAllPayments() {
    const payments = await Payment.find()
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    const totalRevenue = payments.reduce((sum, p) => sum + (p.status === "Paid" ? p.amount : 0), 0);

    return {
      count: payments.length,
      totalRevenue,
      payments,
    };
  }
}

module.exports = new PaymentService();
