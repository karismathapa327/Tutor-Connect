const paymentService = require("../services/payment.service");

const processPayment = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await paymentService.processPayment(studentId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const result = await paymentService.getMyPayments(userId, userRole);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const result = await paymentService.getAllPayments();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  processPayment,
  getMyPayments,
  getAllPayments,
};
