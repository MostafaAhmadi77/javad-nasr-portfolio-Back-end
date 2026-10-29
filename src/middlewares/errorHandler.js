const multer = require("multer")

module.exports = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "Image size must not exceed 2 MB."
          : "An error occurred while uploading the image.",
    });
  }

  if (err.message === "Invalid image format") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      statusCode: 409,
      message: "Article already exists.",
    });
  }

  const statusCode =
    err.name === "ValidationError"
      ? 422
      : err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message:
      statusCode === 422
        ? err.errors || err.message
        : statusCode === 500
        ? "An internal server error occurred."
        : err.message || "An error occurred.",
  });
}