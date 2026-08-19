const express = require("express");

const {
  generateLeadInsights,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/lead-insights",
  authMiddleware,
  generateLeadInsights
);

module.exports = router;