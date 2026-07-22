const TutorProfile = require("../models/TutorProfile");
const User = require("../models/User");
const Review = require("../models/Review");
const Request = require("../models/Request");
const Session = require("../models/Session");
const createNotification = require("../utils/createNotification");

// CREATE PROFILE
const createTutorProfile = async (req, res) => {
  try {
    const existing = await TutorProfile.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "Tutor profile already exists." });
    }

    const profile = await TutorProfile.create({
      user: req.user.id,
      bio: req.body.bio,
      qualifications: req.body.qualifications,
      subjects: req.body.subjects,
      experience: req.body.experience,
      hourlyRate: req.body.hourlyRate,
      availability: req.body.availability || [],
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY PROFILE
const getTutorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const profile = await TutorProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Tutor profile not found." });
    }

    const totalReviews = await Review.countDocuments({ tutor: userId });
    const pendingRequests = await Request.countDocuments({ tutor: userId, status: "Pending" });
    const upcomingSessions = await Session.countDocuments({ tutor: userId, status: "Upcoming" });
    const completedSessions = await Session.countDocuments({ tutor: userId, status: "Completed" });

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
      verificationStatus: profile.verificationStatus,
      verificationDocs: profile.verificationDocs,
      verificationNote: profile.verificationNote,
      totalReviews,
      pendingRequests,
      upcomingSessions,
      completedSessions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
const updateTutorProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Tutor profile not found." });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TUTORS (WITH ADVANCED MULTI-CRITERIA FILTERS)
const getAllTutors = async (req, res) => {
  try {
    const { subject, minRating, minPrice, maxPrice, experience, day, search } = req.query;

    const query = {};

    if (subject) {
      query.subjects = { $elemMatch: { $regex: subject, $options: "i" } };
    }

    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    if (experience) {
      query.experience = { $gte: Number(experience) };
    }

    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) query.hourlyRate.$lte = Number(maxPrice);
    }

    if (day) {
      query["availability.day"] = { $regex: day, $options: "i" };
    }

    let tutors = await TutorProfile.find(query).populate("user", "name email");

    if (search) {
      const searchRegex = new RegExp(search, "i");
      tutors = tutors.filter((t) => {
        const nameMatch = t.user && searchRegex.test(t.user.name);
        const bioMatch = searchRegex.test(t.bio);
        const qualMatch = searchRegex.test(t.qualifications);
        const subjectMatch = t.subjects.some((s) => searchRegex.test(s));
        return nameMatch || bioMatch || qualMatch || subjectMatch;
      });
    }

    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE TUTOR
const getTutorById = async (req, res) => {
  try {
    const tutor = await TutorProfile.findById(req.params.id).populate("user", "name email");

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found." });
    }

    const reviews = await Review.find({ tutor: tutor.user._id }).populate("student", "name");

    res.json({
      tutor,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY REVIEWS
const getTutorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tutor: req.user.id })
      .populate("student", "name")
      .populate("tutor", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD AVAILABILITY SLOT
const addAvailabilitySlot = async (req, res) => {
  try {
    const { day, date, startTime, endTime } = req.body;
    const profile = await TutorProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Tutor profile not found." });
    }

    profile.availability.push({
      day,
      date,
      startTime,
      endTime,
      isBooked: false,
    });

    await profile.save();
    res.status(201).json({ message: "Availability slot added.", availability: profile.availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE AVAILABILITY SLOT
const deleteAvailabilitySlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const profile = await TutorProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Tutor profile not found." });
    }

    profile.availability = profile.availability.filter((slot) => slot._id.toString() !== slotId);
    await profile.save();

    res.status(200).json({ message: "Availability slot removed.", availability: profile.availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT VERIFICATION DOCUMENTS
const submitVerification = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Tutor profile not found." });
    }

    const { docType, externalDocUrl } = req.body;
    let docUrl = externalDocUrl;

    if (req.file) {
      docUrl = `/uploads/${req.file.filename}`;
    }

    if (!docUrl) {
      return res.status(400).json({ message: "Document file or link is required." });
    }

    profile.verificationDocs.push({
      docType: docType || "Degree/Certificate",
      docUrl,
      uploadedAt: new Date(),
    });
    profile.verificationStatus = "Pending";
    await profile.save();

    // Notify admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: req.user.id,
        title: "Tutor Verification Request",
        message: `Tutor requested account verification (${docType || "Certificate"}).`,
        type: "verification",
        link: "/admin/tutors",
      });
    }

    res.status(200).json({
      message: "Verification submitted for Admin review.",
      verificationStatus: profile.verificationStatus,
      verificationDocs: profile.verificationDocs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTutorProfile,
  getTutorProfile,
  updateTutorProfile,
  getAllTutors,
  getTutorById,
  getTutorReviews,
  addAvailabilitySlot,
  deleteAvailabilitySlot,
  submitVerification,
};