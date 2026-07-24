const favoriteService = require("../services/favorite.service");

const toggleFavorite = async (req, res) => {
  try {
    const studentId = req.user.id;
    const tutorId = req.params.tutorId;
    const result = await favoriteService.toggleFavorite(studentId, tutorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getFavoriteTutors = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await favoriteService.getFavoriteTutors(studentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFavoriteIds = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await favoriteService.getFavoriteIds(studentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  toggleFavorite,
  getFavoriteTutors,
  getFavoriteIds,
};
