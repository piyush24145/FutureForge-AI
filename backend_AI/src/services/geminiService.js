const genAI = require("../config/gemini");
const { cleanAndParseJSON } = require("../utils/jsonHelper");

/**
 * Executes a Gemini API call with sequential fallbacks.
 * If gemini-2.5-flash experiences high demand or is unavailable,
 * it will try gemini-2.0-flash, then gemini-1.5-flash, and so on.
 */
const handleGeminiCallWithFallback = async (prompt, responseMimeType = "text", maxOutputTokens = 8192) => {
    const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-pro",
        "gemini-1.5-flash-8b",
        "gemini-flash-latest",
        "gemini-pro-latest"
    ];
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini Service] Requesting content with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const config = {
                maxOutputTokens,
            };
            if (responseMimeType === "application/json") {
                config.responseMimeType = "application/json";
            }

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: config,
            });

            const response = await result.response;
            const text = response.text();
            if (!text) {
                throw new Error("Empty response returned from Gemini.");
            }
            return text;

        } catch (error) {
            console.error(`[Gemini Service] Error using model ${modelName}:`, error.message);
            lastError = error;

            // Halt immediately for invalid keys
            if (
                error.status === 400 ||
                error.status === 403 ||
                error.message?.includes("API key not valid") ||
                error.message?.includes("API_KEY_INVALID")
            ) {
                throw new Error("Invalid Gemini API Key. Please provide a valid GEMINI_API_KEY in backend_AI/.env.");
            }

            // Do not halt immediately for 429 (Rate Limit/Quota). Fallback to alternative models.
            console.warn(`[Gemini Service] Model ${modelName} hit quota or limit. Trying next model...`);
        }
    }

    // If we exhausted all options, check if the last error was a quota issue
    const isQuotaExceeded = lastError?.status === 429 ||
        lastError?.message?.includes("429") ||
        lastError?.message?.includes("Quota") ||
        lastError?.message?.includes("quota");
    if (isQuotaExceeded) {
        throw new Error("Gemini API daily request quota exceeded across all models. Please configure a new GEMINI_API_KEY or wait for the quota to reset.");
    }

    throw new Error(`Gemini API connection failed after trying multiple models. Last error: ${lastError?.message || "Unknown error"}`);
};


const analyzeResumeWithGemini = async (resumeText) => {
    const prompt = `
Analyze the following resume text. Determine the candidate's career match, calculate an appropriate score (0-100) based on their skillset for full stack development, detect their existing skills, identify missing skills, recommend courses, build a step-by-step career learning roadmap, match them with realistic internship positions, and generate relevant technical interview questions for their skills.

Resume Text:
${resumeText}

Response MUST be a JSON object with the following structure:
{
  "score": number,
  "career": string,
  "careerConfidence": number,
  "detectedSkills": [string],
  "missingSkills": [string],
  "roadmap": [
    { "step": number, "title": string, "skill": string, "status": "pending" }
  ],
  "recommendedCourses": [
    { "skill": string, "course": string, "platform": string }
  ],
  "weeklyPlan": [
    { "week": number, "focus": string, "goal": string }
  ],
  "internships": [
    { "company": string, "role": string, "location": string, "stipend": string, "match": string, "skills": [string] }
  ],
  "topMatch": { "company": string, "role": string, "location": string, "stipend": string, "match": string, "skills": [string] },
  "interviewQuestions": [
    { "skill": string, "questions": [string] }
  ],
  "hrQuestions": [string]
}
`;

    const responseText = await handleGeminiCallWithFallback(prompt, "application/json", 8192);
    return cleanAndParseJSON(responseText);
};


const generateInternshipsFromSkills = async (career, detectedSkills) => {
    const prompt = `
Based on the candidate's career track: "${career}" and their detected skills: ${JSON.stringify(detectedSkills)},
generate 5 realistic internship positions they can apply for. 

Response MUST be a JSON object with the following structure:
{
  "internships": [
    { "company": string, "role": string, "location": string, "stipend": string, "match": string, "skills": [string] }
  ]
}
`;

    const responseText = await handleGeminiCallWithFallback(prompt, "application/json", 4096);
    return cleanAndParseJSON(responseText);
};


const generateInterviewQuestions = async (category, resumeText = "") => {
    const prompt = `
Generate exactly 5 professional interview questions for a candidate preparing for a role in the category: "${category}".
${resumeText ? `Use the following resume profile text to customize the questions to their experience: \n${resumeText}` : ""}

The questions should consist of a mix of technical, coding logic, project-related, and HR/behavioral questions as appropriate.
Make the questions challenging, realistic, and professional.

Response MUST be a JSON object with this exact structure:
{
  "questions": [
     { "id": number, "question": string, "type": "Technical" | "HR" | "Behavioral" | "Projects" }
  ]
}
`;

    const responseText = await handleGeminiCallWithFallback(prompt, "application/json", 4096);
    return cleanAndParseJSON(responseText);
};


const evaluateMockInterview = async (category, qaPairs) => {
    const prompt = `
You are an expert technical interviewer. Evaluate the candidate's answers to the following mock interview questions in the "${category}" category.

Questions and Answers:
${JSON.stringify(qaPairs)}

Evaluate their performance critically. Give score out of 100 for communication, technical knowledge, and confidence.
For each question, provide:
1. Constructive feedback explaining what was good or what could be improved.
2. A model answer that demonstrates what a top-tier candidate would answer.
3. A score out of 100 for that specific answer.

Provide an overall score (average of the three component scores), list 3 key strengths, and 3 constructive weaknesses/areas of improvement.

Response MUST be a JSON object with this exact structure:
{
  "communication": number (0-100 score),
  "technicalKnowledge": number (0-100 score),
  "confidence": number (0-100 score),
  "overallScore": number (0-100 score),
  "strengths": [string],
  "weaknesses": [string],
  "questions": [
     {
       "question": string,
       "userAnswer": string,
       "score": number (0-100),
       "feedback": string,
       "modelAnswer": string
     }
  ]
}
`;

    const responseText = await handleGeminiCallWithFallback(prompt, "application/json", 8192);
    return cleanAndParseJSON(responseText);
};


const chatWithMentor = async (message, history = [], resumeText = "") => {
    const systemInstruction = `You are a professional AI Career Mentor. Your goal is to guide students and candidates in their career path, resume preparation, finding internships, and preparing for interviews.
${resumeText ? `Candidate Profile Context (based on analyzed resume):\n${resumeText}\n` : "No analyzed resume is uploaded yet. If asked about their resume or career roadmap, advise them to upload their resume on the 'Resume Analysis' page so you can give highly customized advice."}
Provide professional, encouraging, and highly structured career mentoring. Use simple and clean Markdown layout (bullet points, bold text) where appropriate. Be concise but insightful.`;

    let formattedHistory = "";
    if (history.length > 0) {
        formattedHistory = "Recent Conversation History:\n";
        const recentHistory = history.slice(-10);
        recentHistory.forEach(msg => {
            const roleName = msg.sender === "user" ? "Candidate" : "Mentor";
            formattedHistory += `${roleName}: ${msg.message}\n`;
        });
    }

    const fullPrompt = `${systemInstruction}\n\n${formattedHistory}\nCandidate: ${message}\nMentor:`;

    return await handleGeminiCallWithFallback(fullPrompt, "text", 4096);
};


module.exports = {
    handleGeminiCallWithFallback,
    analyzeResumeWithGemini,
    generateInternshipsFromSkills,
    generateInterviewQuestions,
    evaluateMockInterview,
    chatWithMentor,
};
