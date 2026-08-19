const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const leadRoutes = require("./routes/leadRoutes");
const aiRoutes = require("./routes/aiRoutes");
const activityRoutes = require("./routes/activityRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =====================================
// ROUTES
// =====================================

app.use("/api/leads", leadRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/activities", activityRoutes);
app.use("/api/auth", authRoutes);

// =====================================
// TEST
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI CRM Server is running",
  });
});

// =====================================
// DATABASE
// =====================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

// =====================================
// SERVER
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});