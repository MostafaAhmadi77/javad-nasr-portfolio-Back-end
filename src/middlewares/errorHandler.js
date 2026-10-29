const multer = require("multer");

// میان‌افزار متمرکز مدیریت خطاهای کل برنامه
module.exports = (err, req, res, next) => {
  // خطاهای مربوط به پکیج Multer (آپلود فایل)
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image size must not exceed 2 MB."
        : "An error occurred while uploading the image.";

    return res.status(400).json({
      status: 400,
      statusCode: 400,
      success: false,
      error: msg,
      message: msg,
    });
  }

  // خطای نامعتبر بودن فرمت تصویر
  if (err.message === "Invalid image format") {
    return res.status(400).json({
      status: 400,
      statusCode: 400,
      success: false,
      error: err.message,
      message: err.message,
    });
  }

  // خطای فیلد تکراری در مونگو (کد 11000)
  if (err.code === 11000) {
    const msg = "Article already exists.";
    return res.status(409).json({
      status: 409,
      statusCode: 409,
      success: false,
      error: msg,
      message: msg,
    });
  }

  // خطاهای اعتبارسنجی Yup یا Mongoose
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
