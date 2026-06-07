const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
    createUser,
    getUsers,
    deleteUser,
    getUserProfile,
    updateUserProfile,
    getUserSettings,
    updateUserSettings,
    changePassword,
} = require("../controllers/userController");

// Create User
router.post("/create", createUser);

// Get All Users
router.get("/", getUsers);

// Profile routes (Protected)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Settings routes (Protected)
router.get("/settings", protect, getUserSettings);
router.put("/settings", protect, updateUserSettings);

// Password route (Protected)
router.put("/change-password", protect, changePassword);

// Delete User
router.delete("/:id", deleteUser);

module.exports = router;