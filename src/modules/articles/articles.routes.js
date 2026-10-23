const express = require("express")
const router = express.Router()
const controller = require("./articles.controller.js")

const upload = require("./../../middlewares/uploader.js")

router.route("/").post(upload.single("picture"),controller.create).get(controller.getAll)
router.delete("/:id/remove",controller.remove)

module.exports = router