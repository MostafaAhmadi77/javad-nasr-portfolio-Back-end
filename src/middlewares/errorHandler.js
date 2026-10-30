const multer = require("multer");

// میان‌افزار متمرکز مدیریت خطاهای سرور
module.exports = (err, req, res, next) => {
  // ۱. خطاهای پکیج Multer (آپلود عکس)
  if (err instanceof multer.MulterError) {
    const msg =
      err.code === "LIMIT_FILE_SIZE"
        ? "حجم هر تصویر نباید بیشتر از ۲ مگابایت باشد."
        : err.code === "LIMIT_UNEXPECTED_FILE"
        ? "حداکثر ۲ تصویر می‌توانید آپلود کنید."
        : "خطایی هنگام آپلود تصویر رخ داد.";

    return res.status(400).json({
      status: 400,
      statusCode: 400,
      success: false,
      error: msg,
      message: msg,
    });
  }

  // ۲. خطای فرمت نامعتبر تصویر
  if (err.message && err.message.includes("Invalid image format")) {
    return res.status(400).json({
      status: 400,
      statusCode: 400,
      success: false,
      error: "فرمت تصویر معتبر نیست. فقط فرمت‌های JPEG، PNG و WebP مجاز هستند.",
      message: "فرمت تصویر معتبر نیست. فقط فرمت‌های JPEG، PNG و WebP مجاز هستند.",
    });
  }

  // ۳. خطای کلید تکراری در مونگو (مانند عنوان مقاله تکراری - کد 11000)
  if (err.code === 11000) {
    const msg = "مقاله‌ای با این عنوان قبلاً ثبت شده است.";
    return res.status(409).json({
      status: 409,
      statusCode: 409,
      success: false,
      error: msg,
      message: msg,
    });
  }

  // ۴. خطاهای اعتبارسنجی Yup یا Mongoose
  const statusCode =
    err.name === "ValidationError"
      ? 422
      : err.statusCode || err.status || 500;

  const errorMessage =
    statusCode === 422
      ? err.errors || err.message
      : statusCode === 500
      ? "یک خطای داخلی در سرور رخ داده است."
      : err.message || "خطایی رخ داده است.";

  return res.status(statusCode).json({
    status: statusCode,
    statusCode,
    success: false,
    error: errorMessage,
    message:
      typeof errorMessage === "string"
        ? errorMessage
        : "خطای اعتبارسنجی مقادیر ورودی رخ داد.",
  });
};
