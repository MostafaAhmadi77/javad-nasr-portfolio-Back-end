const express = require("express")
const app = express()

app.use(express.json({limit:"50mb"}))


module.exports = app