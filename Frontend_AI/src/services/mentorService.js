import api from "../api/api";

export const askMentor = async (message, history) => {
    const response = await api.post("/mentor/chat", { message, history });
    return response.data;
};
