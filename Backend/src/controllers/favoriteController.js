const Favorite = require("../models/Favorite");
const TutorProfile = require("../models/TutorProfile");

// Toggle favorite tutor
const toggleFavorite = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { tutorId } = req.params;

    const existing = await Favorite.findOne({ student: studentId, tutor: tutorId });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.status(200).json({
        isFavorite: false,
        message: "Tutor removed from favorites.",
      });
    } else {
      await Favorite.create({ student: studentId, tutor: tutorId });
      return res.status(201).json({
        isFavorite: true,
        message: "Tutor added to favorites.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get list of student's favorite tutors
const getFavoriteTutors = async (req, res) => {
  try {
    const favorites = await Favorite.find({ student: req.user.id }).populate("tutor", "name email role");
    const tutorUserIds = favorites.map((f) => f.tutor._id);

    // Fetch corresponding tutor profiles
    const tutorProfiles = await TutorProfile.find({ user: { $in: tutorUserIds } }).populate("user", "name email");

    res.status(200).json({
      count: tutorProfiles.length,
      tutors: tutorProfiles,
      favoriteTutorIds: tutorUserIds.map((id) => id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get array of favorite tutor user IDs for quick UI status check
const getFavoriteIds = async (req, res) => {
  try {
    const favorites = await Favorite.find({ student: req.user.id }).select("tutor");
    const favoriteIds = favorites.map((f) => f.tutor.toString());
    res.status(200).json({ favoriteIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  toggleFavorite,
  getFavoriteTutors,
  getFavoriteIds,
};
