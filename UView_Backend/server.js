const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const resumeRoutes = require("./routes/resumeRoutes");
require('dotenv').config();

const app = express(); //  FIRST: app define karo

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/v1/auth", authRoutes); // ✅ Ab yeh chalega
app.use("/api/v1/resume", resumeRoutes);

// Health check route
app.get("/api/v1/healthcheck", (req, res) => {
  res.status(200).json({ message: "UView backend is up and running!" });
});

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err.message);
});
