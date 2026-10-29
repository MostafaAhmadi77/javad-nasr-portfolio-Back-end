const express = require("express");
const path = require("path");
const { setHeaders } = require("./middlewares/setHeaders.js");
const articlesRouter = require("./modules/articles/articles.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(setHeaders);

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public/uploads/articles"))
);

app.use("/api/v1/articles", articlesRouter);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Page not found, please check path or method.",
  });
});

app.use(errorHandler);

module.exports = app;