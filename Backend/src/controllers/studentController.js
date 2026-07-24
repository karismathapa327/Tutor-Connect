const dashboardService = require("../services/dashboard.service");
const tutorService = require("../services/tutor.service");

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await dashboardService.getStudentDashboard(studentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSuggestedTutors = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await tutorService.getAllTutors(req.query);
    res.status(200).json({
      tutors: result.tutors || [],
      count: result.count || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getStudentDashboard,
  getSuggestedTutors,
};
