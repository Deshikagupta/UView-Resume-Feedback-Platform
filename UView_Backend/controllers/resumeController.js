const Resume = require("../models/resumeModel");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

//Upload a resume
exports.uploadResume = async (req, res) => {
  try {
    const { title, description, tags, resumeUrl, isAnonymous } = req.body;

    if (!resumeUrl || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const resume = await Resume.create({
      title,
      description,
      tags: Array.isArray(tags) ? tags : tags?.split(","),
      resumeUrl,
      uploadedBy: req.user.id,
      isAnonymous: isAnonymous === true || isAnonymous === "true"
    });

    res.status(201).json(resume);
  } catch (err) {
    console.error("error :", err);
    res.status(500).json({ message: "Resume upload failed", error: err.message });
  }
};


// Like a resume
exports.likeResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Resume not found" });

  const userId = req.user.id;

  // Already liked? Remove like
  if (resume.likedBy.includes(userId)) {
    resume.likes--;
    resume.likedBy.pull(userId);
    await resume.save();
    return res.status(200).json({ message: "Like removed" });
  }

  // If disliked before, remove dislike and switch to like
  if (resume.dislikedBy.includes(userId)) {
    resume.dislikes--;
    resume.dislikedBy.pull(userId);
  }

  resume.likes++;
  resume.likedBy.push(userId);
  await resume.save();

  res.status(200).json({ message: "Liked!" });
};

// Dislike a resume
exports.dislikeResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) return res.status(404).json({ message: "Resume not found" });

  const userId = req.user.id;

  // Already disliked? Remove dislike
  if (resume.dislikedBy.includes(userId)) {
    resume.dislikes--;
    resume.dislikedBy.pull(userId);
    await resume.save();
    return res.status(200).json({ message: "Dislike removed" });
  }

  // If liked before, remove like and switch to dislike
  if (resume.likedBy.includes(userId)) {
    resume.likes--;
    resume.likedBy.pull(userId);
  }

  resume.dislikes++;
  resume.dislikedBy.push(userId);
  await resume.save();

  res.status(200).json({ message: "Disliked!" });
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const comment = {
      user: req.user.id,
      text,
      createdAt: new Date()
    };

    resume.comments.push(comment);
    await resume.save();
    res.status(201).json({ message: "Comment added", comments: resume.comments });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

//get all comments
exports.getResumeWithComments = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
      .populate("comments.user", "name email")
      .populate("uploadedBy", "name email")
      .populate("likedBy", "name email")           
      .populate("dislikedBy", "name email"); 

    if (!resume) return res.status(404).json({ message: "Resume not found" });

    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ message: "Error getting resume", error: err.message });
  }
};

//mark comment as helpful
exports.markCommentHelpful = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const comment = resume.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only uploader can mark as helpful
    if (resume.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only uploader can mark helpful" });
    }

    comment.isHelpful = true;
    await resume.save();
    res.status(200).json({ message: "Marked as helpful" });
  } catch (err) {
    res.status(500).json({ message: "Error marking helpful", error: err.message });
  }
};

// Delete comment (only by uploader or commenter)
exports.deleteComment = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const comment = resume.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      comment.user.toString() !== req.user.id &&
      resume.uploadedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    resume.comments.pull(req.params.commentId);
    await resume.save();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};

//search a resume by tag
exports.searchByTags = async (req, res) => {
  try {
    const tags = req.query.tags?.split(",") || [];

    const resumes = tags.length
      ? await Resume.find({ tags: { $in: tags } }).populate("uploadedBy", "name email")
      : await Resume.find().populate("uploadedBy", "name email");

    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ message: "Tag search failed", error: err.message });
  }
};
