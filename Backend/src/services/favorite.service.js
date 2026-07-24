const Favorite = require("../models/Favorite");

class FavoriteService {
  async toggleFavorite(studentId, tutorId) {
    const existing = await Favorite.findOne({
      student: studentId,
      tutor: tutorId,
    });

    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return { isFavorite: false, message: "Removed from favorites." };
    }

    await Favorite.create({
      student: studentId,
      tutor: tutorId,
    });

    return { isFavorite: true, message: "Added to favorites." };
  }

  async getFavoriteTutors(studentId) {
    const favorites = await Favorite.find({ student: studentId })
      .populate("tutor", "name email")
      .sort({ createdAt: -1 });

    return {
      count: favorites.length,
      favorites,
    };
  }

  async getFavoriteIds(studentId) {
    const favorites = await Favorite.find({ student: studentId }).select("tutor");

    const favoriteIds = favorites.map((fav) => fav.tutor.toString());

    return {
      count: favoriteIds.length,
      favoriteIds,
    };
  }
}

module.exports = new FavoriteService();
