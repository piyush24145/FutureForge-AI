const {
    generateInterviewQuestions,
    evaluateMockInterview,
} = require("../services/geminiService");

const InterviewHistory = require("../models/InterviewHistory");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const { getFallbackQuestions, getFallbackGrading } = require("../utils/fallbackQuestions");

const generateQuestions = async (req, res) => {
    try {
        const { category } = req.body;
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        // Try to get user's resume analysis to customize questions
        let resumeText = "";
        const latestAnalysis = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        if (latestAnalysis) {
            resumeText = `Candidate's target career: ${latestAnalysis.career}. Detected skills: ${latestAnalysis.detectedSkills.join(", ")}.`;
        }

        try {
            const result = await generateInterviewQuestions(category, resumeText);
            return res.status(200).json({
                success: true,
                questions: result.questions || [],
            });
        } catch (geminiError) {
            console.warn("Gemini generation failed, using local fallback questions. Error:", geminiError.message);
            const fallbackList = getFallbackQuestions(category);
            return res.status(200).json({
                success: true,
                questions: fallbackList,
                isFallback: true,
                message: "Using pre-generated questions (AI currently rate-limited)",
            });
        }
    } catch (error) {
        console.error("Error in generateQuestions controller:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to generate interview questions",
        });
    }
};

const evaluateInterviewAnswer = async (req, res) => {
    try {
        const { category, questions } = req.body;

        if (!category || !questions || !Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                message: "Category and questions array are required",
            });
        }

        let report;
        let isFallback = false;

        try {
            report = await evaluateMockInterview(category, questions);
        } catch (geminiError) {
            console.warn("Gemini evaluation failed, using local grading heuristics. Error:", geminiError.message);
            report = getFallbackGrading(category, questions);
            isFallback = true;
        }

        // Save to history linked to user
        const newRecord = await InterviewHistory.create({
            userId: req.user.id,
            category,
            score: report.overallScore || 0,
            communication: report.communication || 0,
            technicalKnowledge: report.technicalKnowledge || 0,
            confidence: report.confidence || 0,
            strengths: report.strengths || [],
            weaknesses: report.weaknesses || [],
            questions: report.questions || [],
            feedback: isFallback ? "Evaluated using local fallback engine." : "Evaluated using Gemini AI.",
        });

        res.status(200).json({
            success: true,
            report: newRecord,
            isFallback,
            message: isFallback ? "Evaluated using local grading engine (AI currently rate-limited)" : undefined,
        });
    } catch (error) {
        console.error("Error in evaluateInterviewAnswer controller:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to evaluate interview answers",
        });
    }
};

const getInterviewHistory = async (req, res) => {
    try {
        const history = await InterviewHistory.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            history,
        });
    } catch (error) {
        console.error("Error getting interview history:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch interview history",
        });
    }
};

const getReadinessScore = async (req, res) => {
    try {
        // Average score of past mock interviews
        const history = await InterviewHistory.find({ userId: req.user.id });
        
        let score = 0;
        if (history.length > 0) {
            const sum = history.reduce((acc, curr) => acc + (curr.score || 0), 0);
            score = Math.round(sum / history.length);
        } else {
            // Fallback: check resume analysis score if it exists
            const latestAnalysis = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
            if (latestAnalysis) {
                score = latestAnalysis.score || 0;
            }
        }

        res.status(200).json({
            success: true,
            score,
        });
    } catch (error) {
        console.error("Error getting readiness score:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch readiness score",
        });
    }
};

module.exports = {
    generateQuestions,
    evaluateInterviewAnswer,
    getInterviewHistory,
    getReadinessScore,
};