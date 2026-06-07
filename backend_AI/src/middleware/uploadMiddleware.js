const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );
    },
});

const fileFilter = (
    req,
    file,
    cb
) => {

    if (
        file.mimetype !==
        "application/pdf"
    ) {

        return cb(
            new Error(
                "Only PDF files are allowed"
            ),
            false
        );

    }

    cb(null, true);
};

const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize:
            1024 * 1024 * 5,
    },
});

module.exports = upload;