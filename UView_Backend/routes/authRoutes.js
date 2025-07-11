const express = require("express");
const router = express.Router();
const { registerUser, loginUser,getUserProfileStats, updateUserDescription } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", protect, getUserProfileStats)
router.put("/update-description", protect, updateUserDescription)

module.exports = router;
