const path = require("path");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const {
    extractTextFromPDF,
} = require("../services/pdfService");

const {
    analyzeResumeWithGemini,
    generateInternshipsFromSkills,
} = require("../services/geminiService");

const uploadResume = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message:
                    "No Resume Uploaded",
            });

        }

        const filePath = path.join(
            req.file.path
        );

        const extractedText =
            await extractTextFromPDF(
                filePath
            );

        const analysis =
            await analyzeResumeWithGemini(
                extractedText
            );

        // Save analysis to MongoDB for the current user
        const savedAnalysis = await ResumeAnalysis.create({
            userId: req.user.id,
            fileName: req.file.originalname || req.file.filename,
            score: analysis.score,
            career: analysis.career,
            detectedSkills: analysis.detectedSkills || analysis.skills || [],
            missingSkills: analysis.missingSkills || [],
            roadmap: analysis.roadmap || [],
            recommendedCourses: analysis.recommendedCourses || [],
            interviewQuestions: analysis.interviewQuestions || [],
            internships: analysis.internships || [],
            preview: extractedText.substring(0, 300),
        });

        res.status(200).json({
            success: true,
            message: "Resume Analysis Complete",
            ...savedAnalysis.toObject(),
        });

    } catch (error) {
        console.error("Upload error:", error);
        let status = 500;
        if (error.message && (error.message.includes("quota exceeded") || error.message.includes("429"))) {
            status = 429;
        } else if (error.message && (error.message.includes("Invalid Gemini API Key") || error.message.includes("API key not valid"))) {
            status = 400;
        }
        res.status(status).json({
            success: false,
            message: error.message,
        });
    }

};

const getResumeHistory = async (req, res) => {
    try {
        const history = await ResumeAnalysis.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            history,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteResumeAnalysis = async (req, res) => {
    try {
        const deleted = await ResumeAnalysis.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Resume analysis record not found or unauthorized",
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume analysis deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getLatestResumeAnalysis = async (req, res) => {
    try {
        const latest = await ResumeAnalysis.findOne({ userId: req.user.id })
            .sort({ createdAt: -1 });

        if (!latest) {
            return res.status(200).json({
                success: true,
                message: "No resume analysis found",
                analysis: null,
            });
        }

        res.status(200).json({
            success: true,
            analysis: latest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const generateInternshipsForAnalysis = async (req, res) => {
    try {
        const latest = await ResumeAnalysis.findOne({ userId: req.user.id })
            .sort({ createdAt: -1 });

        if (!latest) {
            return res.status(404).json({
                success: false,
                message: "No resume analysis found. Please upload a resume first.",
            });
        }

        // Generate matching internships using Gemini
        const result = await generateInternshipsFromSkills(
            latest.career,
            latest.detectedSkills || []
        );

        latest.internships = result.internships || [];
        await latest.save();

        res.status(200).json({
            success: true,
            message: "Internships generated successfully",
            analysis: latest,
        });
    } catch (error) {
        console.error("Generate internships error:", error);
        let status = 500;
        if (error.message && (error.message.includes("quota exceeded") || error.message.includes("429"))) {
            status = 429;
        } else if (error.message && (error.message.includes("Invalid Gemini API Key") || error.message.includes("API key not valid"))) {
            status = 400;
        }
        res.status(status).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadResume,
    getResumeHistory,
    deleteResumeAnalysis,
    getLatestResumeAnalysis,
    generateInternshipsForAnalysis,
};