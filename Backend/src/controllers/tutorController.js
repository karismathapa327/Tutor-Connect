const TutorProfile = require("../models/TutorProfile");
const Review = require("../models/Review");
const asyncHandler = require("express-async-handler");

// Create Tutor Profile
const createTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      bio,
      qualifications,
      subjects,
      experience,
      hourlyRate,
      availability,
    } = req.body;

    // Check if profile already exists
    const existingProfile = await TutorProfile.findOne({
      user: userId,
    });

    if (existingProfile) {
      return res.status(400).json({
        message: "Tutor profile already exists.",
      });
    }

    // Create profile
    const tutorProfile = await TutorProfile.create({
      user: userId,
      bio,
      qualifications,
      subjects,
      experience,
      hourlyRate,
      availability,
    });

    res.status(201).json({
      message: "Tutor profile created successfully.",
      tutorProfile,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Tutor Profile
const getTutorProfile = asyncHandler(async (req, res) => {

    const tutor = await TutorProfile.findOne({
        user: req.user.id,
    });

    if (!tutor) {
        res.status(404);
        throw new Error("Tutor profile not found.");
    }

    res.json(tutor);

});

// Update Tutor Profile
const updateTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedProfile = await TutorProfile.findOneAndUpdate(
      { user: userId },     // Find profile by logged-in user
      req.body,             // New data from request
      {
        returnDocument: true,          // Return updated document
        runValidators: true // Apply schema validation
      }
    ).populate("user", "name email role");

    if (!updatedProfile) {
      return res.status(404).json({
        message: "Tutor profile not found."
      });
    }

    res.status(200).json({
      message: "Tutor profile updated successfully.",
      tutorProfile: updatedProfile
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get All Tutors (with subject filter)
const getAllTutors = async (req, res) => {
  try {

    const { subject } = req.query;

    let filter = {};

    if (subject) {
      filter.subjects = { $regex: subject, $options: "i" };
    }

    const tutors = await TutorProfile.find(filter)
      .populate("user", "name email");

    res.status(200).json({
      count: tutors.length,
      tutors,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Tutor Profile
const getTutorById = async (req, res) => {
  try {

    const tutor = await TutorProfile.findById(req.params.id)
      .populate("user", "name email role");

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor not found."
      });
    }
    const reviews = await Review.find({
        tutor: tutor.user._id
    }).populate("student", "name");

    res.status(200).json({tutor, reviews});

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};




module.exports = {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
};