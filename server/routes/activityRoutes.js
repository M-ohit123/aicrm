const express = require("express");

const {
  createActivity,
  getLeadActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

const router = express.Router();

// CREATE
router.post("/", createActivity);

// GET LEAD ACTIVITIES
router.get("/lead/:leadId", getLeadActivities);

// GET SINGLE ACTIVITY
router.get("/:id", getActivityById);

// UPDATE
router.put("/:id", updateActivity);

// DELETE
router.delete("/:id", deleteActivity);

module.exports = router;