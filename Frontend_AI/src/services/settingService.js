import api from "../api/api";

export const getUserSettings = async () => {
    const response = await api.get("/users/settings");
    return response.data;
};

export const updateUserSettings = async (settings) => {
    const response = await api.put("/users/settings", settings);
    return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
    const response = await api.put("/users/change-password", {
        currentPassword,
        newPassword
    });
    return response.data;
};
