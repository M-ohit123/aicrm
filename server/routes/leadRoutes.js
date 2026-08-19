const express = require("express");

const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  saveAIInsights,
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all leads
router.get("/", authMiddleware, getLeads);

// GET single lead
router.get("/:id", authMiddleware, getLeadById);

// CREATE lead
router.post("/", authMiddleware, createLead);

// UPDATE lead
router.put("/:id", authMiddleware, updateLead);

// SAVE AI insights
router.put(
  "/:id/ai-insights",
  authMiddleware,
  saveAIInsights
);

// DELETE lead
router.delete("/:id", authMiddleware, deleteLead);

module.exports = router;