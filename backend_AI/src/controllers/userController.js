const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create User
const createUser = async (req, res) => {
    try {

        const user = await User.create({
            name: "Piyush",
            email: `piyush${Date.now()}@gmail.com`,
        });

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            data: user,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Get All Users
const getUsers = async (req, res) => {
    try {

        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User Deleted Successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const ResumeAnalysis = require("../models/ResumeAnalysis");

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        // Check for latest resume analysis
        let latestResume = null;
        try {
            latestResume = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        } catch (err) {
            console.error("Failed to query latest resume for profile:", err.message);
        }

        // Build profile combining database values with resume analysis fallbacks
        const profile = {
            skills: user.profile && user.profile.skills && user.profile.skills.length 
                ? user.profile.skills 
                : (latestResume?.detectedSkills || []),
            education: {
                degree: user.profile?.education?.degree || "",
                major: user.profile?.education?.major || "",
                gradYear: user.profile?.education?.gradYear || "",
            },
            careerGoal: user.profile?.careerGoal || (latestResume?.career || ""),
            projectsCompleted: user.profile?.projectsCompleted || 0,
            internshipsApplied: user.profile?.internshipsApplied || 0,
            hasResume: !!latestResume,
            resumeScore: latestResume?.score || null,
        };

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, skills, education, careerGoal, projectsCompleted, internshipsApplied } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (!user.profile) {
            user.profile = {};
        }

        if (skills) user.profile.skills = Array.isArray(skills) ? skills : [];
        if (education) {
            user.profile.education = {
                degree: education.degree || "",
                major: education.major || "",
                gradYear: education.gradYear || "",
            };
        }
        if (careerGoal !== undefined) user.profile.careerGoal = careerGoal;
        if (projectsCompleted !== undefined) user.profile.projectsCompleted = projectsCompleted;
        if (internshipsApplied !== undefined) user.profile.internshipsApplied = internshipsApplied;

        await user.save();

        let latestResume = null;
        try {
            latestResume = await ResumeAnalysis.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
        } catch (err) {
            console.error("Failed to query latest resume for profile:", err.message);
        }

        const mergedProfile = {
            skills: user.profile.skills && user.profile.skills.length 
                ? user.profile.skills 
                : (latestResume?.detectedSkills || []),
            education: {
                degree: user.profile.education?.degree || "",
                major: user.profile.education?.major || "",
                gradYear: user.profile.education?.gradYear || "",
            },
            careerGoal: user.profile.careerGoal || (latestResume?.career || ""),
            projectsCompleted: user.profile.projectsCompleted || 0,
            internshipsApplied: user.profile.internshipsApplied || 0,
            hasResume: !!latestResume,
            resumeScore: latestResume?.score || null,
        };

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: mergedProfile,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get User Settings
const getUserSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }
        res.status(200).json({
            success: true,
            settings: user.settings || {
                darkMode: false,
                emailNotifications: true,
                interviewReminders: true,
                internshipAlerts: false,
                language: "English",
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update User Settings
const updateUserSettings = async (req, res) => {
    try {
        const { darkMode, emailNotifications, interviewReminders, internshipAlerts, language } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        if (!user.settings) {
            user.settings = {};
        }

        if (darkMode !== undefined) user.settings.darkMode = darkMode;
        if (emailNotifications !== undefined) user.settings.emailNotifications = emailNotifications;
        if (interviewReminders !== undefined) user.settings.interviewReminders = interviewReminders;
        if (internshipAlerts !== undefined) user.settings.internshipAlerts = internshipAlerts;
        if (language !== undefined) user.settings.language = language;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Settings Updated Successfully",
            settings: user.settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required",
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect current password",
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Changed Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createUser,
    getUsers,
    deleteUser,
    getUserProfile,
    updateUserProfile,
    getUserSettings,
    updateUserSettings,
    changePassword,
};