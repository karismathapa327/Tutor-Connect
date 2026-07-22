const express = require("express");
const router = express.Router();

const {
  getMyCertificates,
  generateCertificate,
} = require("../controllers/certificateController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

router.use(protect, authorize("student"));

router.get("/", getMyCertificates);
router.post("/generate", generateCertificate);

module.exports = router;
