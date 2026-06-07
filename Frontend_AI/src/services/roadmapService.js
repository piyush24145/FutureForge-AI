import api from "../api/api";

export const fetchRoadmap = async (role) => {
    const response = await api.post("/roadmap/generate", { role });
    return response.data;
};
