const multer = require("multer");

// Centralized error handling middleware
module.exports = (err, req, res, next) => {
  // 1. Multer upload errors
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image size must not exceed 2 MB."
        : err.code === "LIMIT_UNEXPECTED_FILE"
        ? "Maximum of 2 images allowed."
        : "An error occurred while uploading the image.";

    return res.status(400).json({
      status: 400,
      statusCode: 400,
      success: false,
      error: msg,
      message: msg,
    });
  }

  // 2. Custom file format error
  if (err.message && err.message.includes("Invalid image format")) {
    return res.status(400).json({
      status: 400,
      statusCode: 400,
      success: false,
      error: "Invalid image format. Only JPEG, PNG, and WebP are allowed.",
      message: "Invalid image format. Only JPEG, PNG, and WebP are allowed.",
    });
  }

  // 3. MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    const msg = "Article with this title already exists.";
    return res.status(409).json({
      status: 409,
      statusCode: 409,
      success: false,
      error: msg,
      message: msg,
    });
  }

  // 4. Validation errors (Yup or Mongoose)
  const statusCode =
    err.name === "ValidationError"
      ? 422
      : err.statusCode || err.status || 500;

  const errorMessage =
    statusCode === 422
      ? err.errors || err.message
      : statusCode === 500
      ? "An internal server error occurred."
      : err.message || "An error occurred.";

  return res.status(statusCode).json({
    status: statusCode,
    statusCode,
    success: false,
    error: errorMessage,
    message:
      typeof errorMessage === "string"
        ? errorMessage
        : "Validation error occurred.",
  });
};
