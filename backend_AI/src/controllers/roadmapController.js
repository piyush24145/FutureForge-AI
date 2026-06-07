const { handleGeminiCallWithFallback } = require("../services/geminiService");
const { cleanAndParseJSON } = require("../utils/jsonHelper");

const generateRoadmap = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }

        const prompt = `
Create a structured month-wise learning roadmap and recommended projects for someone aspiring to become a "${role}".

Response MUST be a JSON object with the following structure:
{
  "role": string,
  "roadmap": [
    { "month": "Month 1", "skills": [string] },
    { "month": "Month 2", "skills": [string] },
    { "month": "Month 3", "skills": [string] }
  ],
  "projects": [string]
}
`;

        const resultText = await handleGeminiCallWithFallback(prompt, "application/json", 4096);
        const data = cleanAndParseJSON(resultText);

        res.status(200).json({
            success: true,
            data,
        });


    } catch (error) {
        console.error("Roadmap generation error:", error);
        let status = 500;
        let message = error.message;

        if (error.status === 429 || error.message?.includes("429") || error.message?.includes("Quota") || error.message?.includes("quota")) {
            status = 429;
            message = "Gemini API daily request quota exceeded. Please configure a valid GEMINI_API_KEY in backend_AI/.env or wait for the quota to reset.";
        } else if (error.message?.includes("API key not valid") || error.message?.includes("API_KEY_INVALID")) {
            status = 400;
            message = "Invalid Gemini API Key. Please provide a valid GEMINI_API_KEY in backend_AI/.env.";
        }

        res.status(status).json({
            success: false,
            message: message,
        });
    }
};

module.exports = {
    generateRoadmap,
};
