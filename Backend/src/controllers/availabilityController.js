const availabilityService = require("../services/availability.service");

const getTutorSlots = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const dateFilter = req.query.date;
    const result = await availabilityService.getTutorSlots(tutorId, dateFilter);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const dateFilter = req.query.date;
    const result = await availabilityService.getAvailableSlots(tutorId, dateFilter);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSlot = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await availabilityService.createSlot(tutorId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await availabilityService.deleteSlot(req.params.id, tutorId);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") || error.message.includes("authorized") || error.message.includes("booked") ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

const blockSlot = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await availabilityService.blockSlot(req.params.id, tutorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const unblockSlot = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await availabilityService.unblockSlot(req.params.id, tutorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTutorSlotStats = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await availabilityService.getTutorSlotStats(tutorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTutorSlots,
  getAvailableSlots,
  createSlot,
  deleteSlot,
  blockSlot,
  unblockSlot,
  getTutorSlotStats,
};
