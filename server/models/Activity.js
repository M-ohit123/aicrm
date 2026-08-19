const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    // ===============================
    // LEAD REFERENCE
    // ===============================

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    // ===============================
    // ACTIVITY TYPE
    // ===============================

    type: {
      type: String,
      enum: [
        "Call",
        "Email",
        "Meeting",
        "Note",
        "Follow Up",
        "Status Change",
      ],
      required: true,
    },

    // ===============================
    // ACTIVITY TITLE
    // ===============================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ===============================
    // DESCRIPTION
    // ===============================

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ===============================
    // ACTIVITY DATE
    // ===============================

    activityDate: {
      type: Date,
      default: Date.now,
    },

    // ===============================
    // OPTIONAL USER
    // ===============================

    createdBy: {
      type: String,
      default: "System",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Activity",
  activitySchema
);