const tutorService = require("../services/tutor.service");

const getTutorDashboard = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const result = await tutorService.getTutorDashboard(tutorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTutorDashboard,
};
