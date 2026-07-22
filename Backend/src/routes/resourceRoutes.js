const express = require("express");
const router = express.Router();

const {
  createResource,
  getAllResources,
  deleteResource,
} = require("../controllers/resourceController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect);

router.get("/", getAllResources);
router.post("/", authorize("tutor"), upload.single("resourceFile"), createResource);
router.delete("/:id", deleteResource);

module.exports = router;
