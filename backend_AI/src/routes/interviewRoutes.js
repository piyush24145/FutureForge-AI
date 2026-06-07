const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    generateQuestions,
    evaluateInterviewAnswer,
    getInterviewHistory,
    getReadinessScore,
} = require("../controllers/interviewController");

// Protect all routes
router.use(protect);

router.post("/generate", generateQuestions);
router.post("/evaluate", evaluateInterviewAnswer);
router.get("/history", getInterviewHistory);
router.get("/readiness", getReadinessScore);

module.exports = router;