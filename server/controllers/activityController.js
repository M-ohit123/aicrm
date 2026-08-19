const Activity = require("../models/Activity");
const Lead = require("../models/Lead");

// =====================================
// CREATE ACTIVITY
// =====================================

const createActivity = async (req, res) => {
  try {
    const {
      lead,
      type,
      title,
      description,
      activityDate,
      createdBy,
    } = req.body;

    // ===============================
    // VALIDATION
    // ===============================

    if (!lead || !type || !title) {
      return res.status(400).json({
        success: false,
        message:
          "Lead, activity type and title are required",
      });
    }

    // ===============================
    // CHECK LEAD
    // ===============================

    const existingLead = await Lead.findById(lead);

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // ===============================
    // CREATE ACTIVITY
    // ===============================

    const activity = await Activity.create({
      lead,
      type,
      title,
      description,
      activityDate,
      createdBy,
    });

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: activity,
    });
  } catch (error) {
    console.error(
      "CREATE ACTIVITY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create activity",
      error: error.message,
    });
  }
};

// =====================================
// GET ACTIVITIES BY LEAD
// =====================================

const getLeadActivities = async (req, res) => {
  try {
    const { leadId } = req.params;

    // ===============================
    // CHECK LEAD
    // ===============================

    const existingLead = await Lead.findById(
      leadId
    );

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // ===============================
    // GET ACTIVITIES
    // ===============================

    const activities = await Activity.find({
      lead: leadId,
    }).sort({
      activityDate: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    console.error(
      "GET LEAD ACTIVITIES ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE ACTIVITY
// =====================================

const getActivityById = async (req, res) => {
  try {
    const activity =
      await Activity.findById(
        req.params.id
      ).populate(
        "lead",
        "name email company"
      );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error(
      "GET ACTIVITY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
      error: error.message,
    });
  }
};
// =====================================
// UPDATE ACTIVITY
// =====================================

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      title,
      description,
      activityDate,
      createdBy,
    } = req.body;

    if (!type || !title) {
      return res.status(400).json({
        success: false,
        message: "Activity type and title are required",
      });
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      {
        type,
        title,
        description,
        activityDate,
        createdBy,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activity updated successfully",
      data: activity,
    });

  } catch (error) {
    console.error(
      "UPDATE ACTIVITY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update activity",
      error: error.message,
    });
  }
};

// =====================================
// DELETE ACTIVITY
// =====================================

const deleteActivity = async (req, res) => {
  try {
    const activity =
      await Activity.findByIdAndDelete(
        req.params.id
      );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE ACTIVITY ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete activity",
      error: error.message,
    });
  }
};

// =====================================
// EXPORT
// =====================================

module.exports = {
  createActivity,
  getLeadActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};