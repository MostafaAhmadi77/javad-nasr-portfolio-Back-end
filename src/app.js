const express = require("express");
const path = require("path");
const { setHeaders } = require("./middlewares/setHeaders.js");
const articlesRouter = require("./modules/articles/articles.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const { swaggerUi, swaggerDocument } = require("./docs/swagger.js");

const app = express();

// میان‌افزارهای پردازش بدنه درخواست (Body Parser)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// میان‌افزار تنظیم هدرهای CORS
app.use(setHeaders);

// سرو فایل‌های استاتیک آپلود شده
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../public/uploads/articles"))
);

// مستندات Swagger API (قابل دسترسی در /api-docs و /docs)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs", (req, res) => res.redirect("/api-docs"));

// روت بررسی سلامت سرور (Health Check)
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: 200,
    statusCode: 200,
    success: true,
    message: "Server is healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// روت خوش‌آمدگویی نسخه ۱ API
app.get("/api/v1", (req, res) => {
  return res.status(200).json({
    status: 200,
    statusCode: 200,
    success: true,
    message: "Javad Nasr Portfolio Backend API v1",
  });
});

// روت‌های اصلی مقالات
app.use("/api/v1/articles", articlesRouter);

// مدیریت خطای مسیرهای ناموجود (404 Not Found)
app.use((req, res) => {
  return res.status(404).json({
    status: 404,
    statusCode: 404,
    success: false,
    error: "Page not found, please check path or method.",
    message: "Page not found, please check path or method.",
  });
});

// میان‌افزار متمرکز مدیریت خطاها (Centralized Error Handler)
app.use(errorHandler);

module.exports = app;
