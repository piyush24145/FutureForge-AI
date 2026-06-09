const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const chatHistory = require("../middleware/chatHistory");
const { getMentorResponse } = require("../controllers/mentorController");

// Protected endpoint to chat with Gemini Career Mentor
router.post("/chat", protect, chatHistory, getMentorResponse);

// Reset chat history for current user
router.post("/reset", protect, (req, res) => {
  req.session.chatHistory = [];
  req.session.save(err => {
    if (err) return res.status(500).json({ success: false, message: "Failed to reset chat" });
    res.json({ success: true, message: "Chat history cleared" });
  });
});

module.exports = router;
