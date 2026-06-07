import api from "../api/api";

export const generateQuestions = async (category) => {
    const response = await api.post("/interview/generate", { category });
    return response.data;
};

export const submitInterview = async (category, questions) => {
    const response = await api.post("/interview/evaluate", { category, questions });
    return response.data;
};

export const getInterviewHistory = async () => {
    const response = await api.get("/interview/history");
    return response.data;
};

export const getReadinessScore = async () => {
    const response = await api.get("/interview/readiness");
    return response.data;
};
