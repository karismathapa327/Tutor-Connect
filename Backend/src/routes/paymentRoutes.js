const express = require("express");
const router = express.Router();

const {
  processPayment,
  getMyPayments,
  getAllPayments,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMidlleware");

router.use(protect);

router.post("/pay", authorize("student"), processPayment);
router.get("/my-payments", getMyPayments);
router.get("/admin/all", authorize("admin"), getAllPayments);

module.exports = router;
