const { chatWithMentor } = require("../services/geminiService");
const ResumeAnalysis = require("../models/ResumeAnalysis");

const getMentorResponse = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        // Try to get user's latest resume analysis for context-aware mentoring
        let resumeText = "";
        try {
            const latestAnalysis = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
            if (latestAnalysis) {
                resumeText = `Career Match: ${latestAnalysis.career}. Detected Skills: ${(latestAnalysis.detectedSkills || []).join(", ")}. Missing Skills: ${(latestAnalysis.missingSkills || []).join(", ")}.`;
            }
        } catch (dbErr) {
            console.warn("Could not fetch resume analysis context, continuing with empty context. Error:", dbErr.message);
        }

        const aiResponse = await chatWithMentor(message, history || [], resumeText);

        res.status(200).json({
            success: true,
            message: aiResponse,
        });
    } catch (error) {
        console.error("Error in getMentorResponse controller:", error);
        let status = 500;
        let message = error.message;

        if (error.message && (error.message.includes("quota exceeded") || error.message.includes("429"))) {
            status = 429;
        } else if (error.message && (error.message.includes("Invalid Gemini API Key") || error.message.includes("API key not valid"))) {
            status = 400;
        }

        res.status(status).json({
            success: false,
            message: message || "Failed to generate response from Career Mentor AI",
        });
    }
};

module.exports = {
    getMentorResponse,
};
