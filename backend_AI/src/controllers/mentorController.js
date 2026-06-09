const { chatWithMentor } = require("../services/geminiService");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const { formatAIResponse } = require("../utils/formatResponse");

const getMentorResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Initialise or fetch chat history from session
    if (!req.session.chatHistory) req.session.chatHistory = [];
    const history = req.session.chatHistory;

    // Optional resume context
    let resumeText = "";
    try {
      const latestAnalysis = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
      if (latestAnalysis) {
        resumeText = `Career Match: ${latestAnalysis.career}. Detected Skills: ${(latestAnalysis.detectedSkills || []).join(", ")}. Missing Skills: ${(latestAnalysis.missingSkills || []).join(", ")}.`;
      }
    } catch (dbErr) {
      console.warn("Could not fetch resume analysis context, continuing with empty context. Error:", dbErr.message);
    }

    // Call AI with stored history
    const raw = await chatWithMentor(message, history, resumeText);
    const aiResponse = formatAIResponse(raw);

    // Save exchange to session history
    req.session.chatHistory.push({ role: "user", content: message }, { role: "assistant", content: aiResponse });
    req.session.save(err => {
      if (err) console.warn("Failed to save chat history", err);
    });

    res.status(200).json({ success: true, message: aiResponse });
  } catch (error) {
    console.error("Error in getMentorResponse controller:", error);
    let status = 500;
    if (error.message && (error.message.includes("quota exceeded") || error.message.includes("429"))) status = 429;
    else if (error.message && (error.message.includes("Invalid Gemini API Key") || error.message.includes("API key not valid"))) status = 400;
    res.status(status).json({ success: false, message: error.message || "Failed to generate response from Career Mentor AI" });
  }
};

module.exports = {
    getMentorResponse,
};
