const TutorProfile = require("../models/TutorProfile");
const User = require("../models/User");
const Review = require("../models/Review");
const Request = require("../models/Request");
const Session = require("../models/Session");


// CREATE PROFILE

const createTutorProfile = async (req, res) => {

  try {

    const existing = await TutorProfile.findOne({
      user: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        message: "Tutor profile already exists.",
      });
    }

    const profile = await TutorProfile.create({

      user: req.user.id,

      bio: req.body.bio,

      qualifications: req.body.qualifications,

      subjects: req.body.subjects,

      experience: req.body.experience,

      hourlyRate: req.body.hourlyRate,

      availability: req.body.availability,

    });

    res.status(201).json(profile);

  }

  catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET MY PROFILE

const getTutorProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const profile = await TutorProfile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Tutor profile not found.",
      });
    }

    const totalReviews = await Review.countDocuments({
      tutor: userId,
    });

    const pendingRequests = await Request.countDocuments({
      tutor: userId,
      status: "Pending",
    });

    const upcomingSessions = await Session.countDocuments({
      tutor: userId,
      status: "Upcoming",
    });

    const completedSessions = await Session.countDocuments({
      tutor: userId,
      status: "Completed",
    });

    res.status(200).json({

      _id: profile._id,

      name: user.name,
      email: user.email,
      role: user.role,
      memberSince: user.createdAt,

      bio: profile.bio,
      qualifications: profile.qualifications,
      subjects: profile.subjects,
      experience: profile.experience,
      hourlyRate: profile.hourlyRate,
      availability: profile.availability,
      averageRating: profile.averageRating,

      totalReviews,
      pendingRequests,
      upcomingSessions,
      completedSessions,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// UPDATE PROFILE

const updateTutorProfile = async (req, res) => {

  try {

    const profile = await TutorProfile.findOneAndUpdate(

      {
        user: req.user.id,
      },

      req.body,

      {
        new: true,
        runValidators: true,
      }

    );

    if (!profile) {

      return res.status(404).json({
        message: "Tutor profile not found.",
      });

    }

    res.json(profile);

  }

  catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


// GET ALL TUTORS

const getAllTutors = async (req, res) => {

  const tutors = await TutorProfile.find()
    .populate("user", "name email");

  res.json(tutors);

};


// GET SINGLE TUTOR

const getTutorById = async (req, res) => {

  try {

    const tutor = await TutorProfile.findById(req.params.id)
      .populate("user", "name email");

    if (!tutor) {

      return res.status(404).json({
        message: "Tutor not found.",
      });

    }

    const reviews = await Review.find({
      tutor: tutor.user._id,
    }).populate("student", "name");

    res.json({
      tutor,
      reviews,
    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// GET MY REVIEWS

const getTutorReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      tutor: req.user.id,
    })
      .populate("student", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      reviews,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {

  createTutorProfile,

  getTutorProfile,

  updateTutorProfile,

  getAllTutors,

  getTutorById,

  getTutorReviews,

};