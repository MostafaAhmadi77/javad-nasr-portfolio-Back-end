const mongoose = require("mongoose");

// Article schema for MongoDB
const articleSchema = new mongoose.Schema(
  {
    // 1. Article title (must be unique)
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
    },

    // 2. Short summary / excerpt
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 300,
    },

    // 3. Full article content
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 10000,
    },

    // 4. Estimated reading time (e.g. "5 min read")
    readingTime: {
      type: String,
      default: "3 min read",
      trim: true,
    },

    // 5. Ordered pictures array (up to 2 pictures)
    // order 1 = Cover/Hero image
    // order 2 = In-content image
    pictures: [
      {
        url: { type: String, required: true },
        order: { type: Number, required: true, default: 1 },
      },
    ],

    // 6. Direct primary cover image (for backward compatibility)
    picture: {
      type: String,
      default: null,
      trim: true,
    },

    // 7. Publishing status
    status: {
      type: String,
      enum: ["PUBLISHED", "DRAFT"],
      default: "DRAFT",
    },

    // 8. Topic or category tag
    tags: {
      type: String,
      default: "Strategy",
      trim: true,
    },

    // 9. Article author
    author: {
      type: String,
      default: "Javad Nasr",
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false,
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
