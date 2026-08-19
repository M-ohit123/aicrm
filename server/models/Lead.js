const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // ===============================
    // BASIC LEAD INFORMATION
    // ===============================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      default: "Other",
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Converted",
        "Lost",
      ],
      default: "New",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    notes: {
      type: String,
      default: "",
    },

    // ===============================
    // AI INSIGHTS
    // ===============================

    aiInsights: {
      leadScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },

      leadPotential: {
        type: String,
        enum: ["High", "Medium", "Low", null],
        default: null,
      },

      recommendedAction: {
        type: String,
        default: "",
      },

      reason: {
        type: String,
        default: "",
      },

      followUpMessage: {
        type: String,
        default: "",
      },

      generatedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);