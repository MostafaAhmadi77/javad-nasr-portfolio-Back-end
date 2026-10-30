const express = require("express");
const path = require("path");
const { setHeaders } = require("./middlewares/setHeaders.js");
const articlesRouter = require("./modules/articles/articles.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const { swaggerUi, swaggerDocument } = require("./docs/swagger.js");

const app = express();

// Body parser middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS configuration headers
app.use(setHeaders);

// Serve static uploaded files
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../public/uploads/articles"))
);

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/docs", (req, res) => res.redirect("/api-docs"));

// Health check endpoint
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

// Root API welcome endpoint
app.get("/api/v1", (req, res) => {
  return res.status(200).json({
    status: 200,
    statusCode: 200,
    success: true,
    message: "Javad Nasr Portfolio Backend API v1",
  });
});

// Main article routes
app.use("/api/v1/articles", articlesRouter);

// 404 Not Found handler
app.use((req, res) => {
  return res.status(404).json({
    status: 404,
    statusCode: 404,
    success: false,
    error: "Page not found, please check path or method.",
    message: "Page not found, please check path or method.",
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
