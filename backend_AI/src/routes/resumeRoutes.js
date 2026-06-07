const express = require("express");

const router =
    express.Router();

const upload = require(
    "../middleware/uploadMiddleware"
);

const protect = require(
    "../middleware/authMiddleware"
);

const {
    uploadResume,
    getResumeHistory,
    deleteResumeAnalysis,
    getLatestResumeAnalysis,
    generateInternshipsForAnalysis,
} = require(
    "../controllers/resumeController"
);

router.post(
    "/upload",
    protect,
    upload.single("resume"),
    uploadResume
);

router.get(
    "/history",
    protect,
    getResumeHistory
);

router.get(
    "/latest",
    protect,
    getLatestResumeAnalysis
);

router.post(
    "/generate-internships",
    protect,
    generateInternshipsForAnalysis
);

router.delete(
    "/:id",
    protect,
    deleteResumeAnalysis
);

module.exports = router;