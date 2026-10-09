const express = require("express")
const app = express()
const {setHeaders} = require("./middlewares/setHeaders.js")
const articlesRouter = require("./modules/articles/articles.routes.js")
const errorHandler = require("./middlewares/errorHandler");



app.use(express.json({limit:"50mb"}))
app.use(setHeaders)

app.use("/api/v1/articles", articlesRouter);

app.use(errorHandler);

module.exports = app