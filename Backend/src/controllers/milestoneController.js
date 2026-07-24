const milestoneService = require("../services/milestone.service");

const getMyMilestones = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await milestoneService.getMyMilestones(studentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkMilestones = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await milestoneService.checkAndAwardMilestones(studentId);
    res.status(200).json({
      message: `Checked milestones. ${result.length} new milestone(s) achieved.`,
      newMilestones: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyMilestones,
  checkMilestones,
};
