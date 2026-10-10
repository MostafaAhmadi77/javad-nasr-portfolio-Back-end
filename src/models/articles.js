const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    status:{
        type:String,
        enum:["PUBLISHED","DRAFT"],
        default:"DRAFT",
        required:false
    }

}, { timestamps: true })


const articles = mongoose.model("Articles",schema)
module.exports = articles