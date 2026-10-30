const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Uploads directory path
const uploadDir = path.resolve(__dirname, "../../public/uploads/articles");

// Create uploads directory if it does not exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with unique UUID filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

// File filter: only JPEG, PNG, and WebP are allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  const error = new Error("Invalid image format. Only JPEG, PNG, and WebP are allowed.");
  error.statusCode = 400;
  cb(error);
};

// Multer upload middleware with 2MB limit per image
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB max
  },
});

module.exports = upload;
