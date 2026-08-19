const mongoose = require("mongoose");
const Lead = require("../models/Lead");

// =====================================
// CREATE LEAD
// =====================================

const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      priority,
      notes,
    } = req.body;

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      source,
      status,
      priority,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL LEADS
// =====================================

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("GET LEADS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE LEAD
// =====================================

const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findById(id).lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("GET SINGLE LEAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE LEAD
// =====================================

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("UPDATE LEAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};

// =====================================
// SAVE AI INSIGHTS
// =====================================

const saveAIInsights = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      leadScore,
      leadPotential,
      recommendedAction,
      reason,
      followUpMessage,
    } = req.body;

    if (
      leadScore === undefined ||
      !leadPotential ||
      !recommendedAction ||
      !reason ||
      !followUpMessage
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete AI insights are required",
      });
    }

    const score = Number(leadScore);

    if (
      Number.isNaN(score) ||
      score < 0 ||
      score > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Lead score must be between 0 and 100",
      });
    }

    if (
      !["High", "Medium", "Low"].includes(
        leadPotential
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Lead potential must be High, Medium, or Low",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.aiInsights = {
      leadScore: Math.round(score),
      leadPotential,
      recommendedAction,
      reason,
      followUpMessage,
      generatedAt: new Date(),
    };

    await lead.save();

    res.status(200).json({
      success: true,
      message: "AI insights saved successfully",
      data: lead,
    });
  } catch (error) {
    console.error("SAVE AI INSIGHTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save AI insights",
      error: error.message,
    });
  }
};

// =====================================
// DELETE LEAD
// =====================================

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LEAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

// =====================================
// EXPORT
// =====================================

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  saveAIInsights,
  deleteLead,
};