const express = require("express")
const app = express()
const {setHeaders} = require("./middlewares/setHeaders.js")

app.use(express.json({limit:"50mb"}))
app.use(setHeaders)

module.exports = app