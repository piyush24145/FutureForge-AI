const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileName: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        career: {
            type: String,
            required: true,
        },
        detectedSkills: [String],
        missingSkills: [String],
        roadmap: [
            {
                step: Number,
                title: String,
                skill: String,
                status: {
                    type: String,
                    default: "pending",
                },
            },
        ],
        recommendedCourses: [
            {
                skill: String,
                course: String,
                platform: String,
            },
        ],
        interviewQuestions: [
            {
                skill: String,
                questions: [String],
            },
        ],
        internships: [
            {
                company: String,
                role: String,
                location: String,
                stipend: String,
                match: String,
                skills: [String],
            }
        ],
        preview: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
