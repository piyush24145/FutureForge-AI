import api from "../api/api";

export const uploadResume = async (
    formData
) => {

    const response =
        await api.post(
            "/resume/upload",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    return response.data;
};

export const getResumeHistory = async () => {
    const response = await api.get("/resume/history");
    return response.data;
};

export const deleteResume = async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
};

export const getLatestResumeAnalysis = async () => {
    const response = await api.get("/resume/latest");
    return response.data;
};

export const generateInternships = async () => {
    const response = await api.post("/resume/generate-internships");
    return response.data;
};