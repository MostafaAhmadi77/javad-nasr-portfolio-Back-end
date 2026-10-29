const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 250,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 2000,
    },
    picture: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PUBLISHED", "DRAFT"],
      default: "DRAFT",
    },
    tags: {
      type: String,
      enum: ["AI", "Human", "Assisted", "Verified", "Comprehensive"],
      default: "Human",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const articles = mongoose.model("Articles", schema);
module.exports = articles;