const express = require("express");
const router = express.Router();
const { uploadResume,
            likeResume,
            dislikeResume,
            addComment,
            deleteComment,
            getResumeWithComments,
            markCommentHelpful,
            searchByTags
 } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

//Upload resume
router.post("/upload", protect, upload.single("resume"), uploadResume);

// Like / Dislike resume
router.put("/:id/like", protect, likeResume);
router.put("/:id/dislike", protect, dislikeResume);

// Comment routes
router.post("/:id/comment", protect, addComment);
router.delete("/:resumeId/comment/:commentId", protect, deleteComment);

//get all comments
router.get("/:id", getResumeWithComments);

//helpful comment
router.put("/:resumeId/comment/:commentId/helpful", protect, markCommentHelpful);

//search resume
router.get("/", searchByTags); // /api/v1/resume?tags=mern,java

module.exports = router;
