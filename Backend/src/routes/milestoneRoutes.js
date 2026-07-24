const express = require("express");
const router = express.Router();

const {
  getMyMilestones,
  checkMilestones,
} = require("../controllers/milestoneController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

router.use(protect, authorize("student"));

router.get("/", getMyMilestones);
router.post("/check", checkMilestones);

module.exports = router;
