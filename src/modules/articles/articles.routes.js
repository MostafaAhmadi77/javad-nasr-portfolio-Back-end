const express = require("express")
const router = express.Router()
const controller = require("./articles.controller.js")

router.route("/").post(controller.create)

module.exports = router