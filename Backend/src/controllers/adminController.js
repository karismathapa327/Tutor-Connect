const adminService = require("../services/admin.service");

const getAllUsers = async (req, res) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTutors = async (req, res) => {
  try {
    const result = await adminService.getAllTutors(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const result = await adminService.getDashboardStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchedulingStats = async (req, res) => {
  try {
    const result = await adminService.getDashboardStats();
    res.status(200).json({
      totalSlots: result.totalSlots,
      availableSlots: result.availableSlots,
      bookedSlots: result.bookedSlots,
      blockedSlots: result.blockedSlots,
      slotUtilizationRate: result.slotUtilizationRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSessions = async (req, res) => {
  try {
    const result = await adminService.getAllSessions(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const result = await adminService.getAllReviews(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

const getPendingVerifications = async (req, res) => {
  try {
    const result = await adminService.getPendingVerifications();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { status, note } = req.body;
    const result = await adminService.updateVerificationStatus(profileId, status, note);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") || error.message.includes("must be") ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllTutors,
  getDashboardStats,
  getSchedulingStats,
  getAllSessions,
  getAllReviews,
  deleteUser,
  getPendingVerifications,
  updateVerificationStatus,
};
