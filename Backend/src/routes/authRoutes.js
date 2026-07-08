const express = require("express");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
} = require("../controllers/authController");

const { registerValidation } = require("../validators/authValidator");
const validate = require("../middleware/validationMiddleware");

// Register
router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);

// Login
router.post("/login", loginUser);

router.get(
  "/profile",
  protect,
  getProfile
);

// Student Only
router.get(
  "/student",
  protect,
  authorize("student"),
  (req, res) => {
    res.json({
      message: "Welcome Student!",
    });
  }
);

// Tutor Only
router.get(
  "/tutor",
  protect,
  authorize("tutor"),
  (req, res) => {
    res.json({
      message: "Welcome Tutor!",
    });
  }
);

// Admin Only
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin!",
    });
  }
);

router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;