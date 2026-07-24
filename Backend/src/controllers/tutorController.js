const tutorService = require("../services/tutor.service");

const createTutorProfile = async (req, res) => {
  try {
    const result = await tutorService.createProfile(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTutorProfile = async (req, res) => {
  try {
    const result = await tutorService.getMyProfile(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateTutorProfile = async (req, res) => {
  try {
    const result = await tutorService.updateProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllTutors = async (req, res) => {
  try {
    const result = await tutorService.getAllTutors(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTutorById = async (req, res) => {
  try {
    const result = await tutorService.getTutorById(req.params.id);
    res.status(200).json({ tutor: result });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTutorReviews = async (req, res) => {
  try {
    const result = await tutorService.getTutorReviews(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitVerification = async (req, res) => {
  try {
    const verificationData = {
      docType: req.body.docType,
      externalDocUrl: req.body.externalDocUrl,
      docFileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    };

    const result = await tutorService.submitVerification(req.user.id, verificationData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
  getTutorReviews,
  submitVerification,
};
