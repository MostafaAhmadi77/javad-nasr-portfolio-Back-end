const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    }
}, { timestamps: true })


const articles = mongoose.model("Articles",schema)
module.exports = articles