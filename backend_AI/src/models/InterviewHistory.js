const mongoose = require("mongoose");

const interviewHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        communication: {
            type: Number,
            default: 0,
        },
        technicalKnowledge: {
            type: Number,
            default: 0,
        },
        confidence: {
            type: Number,
            default: 0,
        },
        strengths: [String],
        weaknesses: [String],
        questions: [
            {
                question: String,
                userAnswer: String,
                score: Number,
                feedback: String,
                modelAnswer: String,
            }
        ],
        // Backward compatibility
        answer: String,
        feedback: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("InterviewHistory", interviewHistorySchema);