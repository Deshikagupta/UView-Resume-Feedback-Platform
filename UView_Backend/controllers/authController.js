const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const Resume = require("../models/resumeModel")

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.getUserProfileStats = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    const resumes = await Resume.find({ uploadedBy: userId })

    const resumesUploaded = resumes.length
    const likesGiven = resumes.reduce(
      (count, resume) =>
        count +
        (resume.likedBy.includes(userId) ? 1 : 0),
      0
    )

    const commentsMade = resumes.reduce(
      (count, resume) =>
        count +
        resume.comments.filter((c) => c.user.toString() === userId).length,
      0
    )

    res.json({
      description: user.description || "",
      resumesUploaded,
      likesGiven,
      commentsMade,
    })
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message })
  }
}

// Update user description
exports.updateUserDescription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const { description } = req.body
    user.description = description
    await user.save()

    res.status(200).json({ message: "Description updated successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}
