const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getMentorResponse } = require("../controllers/mentorController");

// Protected endpoint to chat with Gemini Career Mentor
router.post("/chat", protect, getMentorResponse);

module.exports = router;
