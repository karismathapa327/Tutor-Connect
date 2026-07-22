const Payment = require("../models/Payment");
const Session = require("../models/Session");
const createNotification = require("../utils/createNotification");

// Process simulated payment
const processPayment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { tutorId, sessionId, requestId, amount, paymentMethod } = req.body;

    if (!tutorId) {
      return res.status(400).json({ message: "tutorId is required." });
    }

    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ message: "A valid amount is required." });
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

    // Notify tutor
    await createNotification({
      recipient: tutorId,
      sender: studentId,
      title: "Payment Received",
      message: `Received simulated payment of $${amount || 25} (TXN: ${transactionId}).`,
      type: "payment",
    });

    res.status(201).json({
      message: "Payment processed successfully.",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my payments (for student or tutor)
const getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

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

    res.status(200).json({
      count: payments.length,
      totalAmount,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin view all payments
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("student", "name email")
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    const totalRevenue = payments.reduce((sum, p) => sum + (p.status === "Paid" ? p.amount : 0), 0);

    res.status(200).json({
      count: payments.length,
      totalRevenue,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getMyPayments,
  getAllPayments,
};
