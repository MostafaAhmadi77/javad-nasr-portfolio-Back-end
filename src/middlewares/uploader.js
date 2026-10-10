const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: "public/uploads/articles",

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${crypto.randomUUID()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    const error = new Error("Invalid image format");
    error.statusCode = 400;
    cb(error);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

module.exports = upload;