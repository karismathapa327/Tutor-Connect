const express = require("express");
const router = express.Router();

const { createRequest,
        getTutorRequests,
        updateRequestStatus,
        getStudentRequests,
      } = require("../controllers/requestController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

// Student sends request
router.post(
  "/",
  protect,
  authorize("student"),
  createRequest
);

router.get(
  "/student",
  protect,
  authorize("student"),
  getStudentRequests
);

router.get(
    "/tutor",
    protect,
    authorize("tutor"),
    getTutorRequests
);

router.put(
  "/:requestId/status",
  protect,
  authorize("tutor"),
  updateRequestStatus
);

module.exports = router;