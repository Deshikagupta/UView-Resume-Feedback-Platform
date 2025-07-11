const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
   isAnonymous: { type: Boolean, default: false }, 
  resumeUrl: { type: String, required: true }, // Cloudinary URL
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      isHelpful: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
