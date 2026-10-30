const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// مسیر پوشه ذخیره‌سازی عکس‌های آپلود شده در سرور
const uploadDir = path.resolve(__dirname, "../../public/uploads/articles");

// اگر پوشه وجود نداشت، خودکار آن را می‌سازیم
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// تنظیم محل ذخیره و ساخت نام یکتا با شناسه تصادفی (UUID)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

// فیلتر فرمت‌های مجاز تصاویر
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  const error = new Error("Invalid image format. Only JPEG, PNG, and WebP are allowed.");
  error.statusCode = 400;
  cb(error);
};

// کانفیگ اصلی آپلود فایل با حداکثر ۲ مگابایت برای هر تصویر
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // حداکثر ۲ مگابایت
  },
});

module.exports = upload;
