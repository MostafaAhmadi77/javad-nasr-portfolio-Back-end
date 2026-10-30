const mongoose = require("mongoose");

// اسکیما (ساختار) مقالات در پایگاه داده MongoDB
const articleSchema = new mongoose.Schema(
  {
    // ۱. عنوان مقاله
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 128,
    },

    // ۲. خلاصه کوتاه مقاله (Excerpt)
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 300,
    },

    // ۳. متن کامل مقاله
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 10000,
    },

    // ۴. مدت زمان تقریبی خواندن مقاله (مثال: "5 min read")
    readingTime: {
      type: String,
      default: "3 min read",
      trim: true,
    },

    // ۵. لیست تصاویر مقاله با حفظ ترتیب دقیق (حداکثر ۲ تصویر)
    // عکس اول (order: 1) = عکس اصلی یا شاخص (Hero Image)
    // عکس دوم (order: 2) = عکس داخلی محتوا (In-content Image)
    pictures: [
      {
        url: { type: String, required: true },
        order: { type: Number, required: true, default: 1 },
      },
    ],

    // ۶. تصویر شاخص اصلی (جهت سازگاری ساده با کدهای قبلی)
    picture: {
      type: String,
      default: null,
      trim: true,
    },

    // ۷. وضعیت انتشار (منتشر شده یا پیش‌نویس)
    status: {
      type: String,
      enum: ["PUBLISHED", "DRAFT"],
      default: "DRAFT",
    },

    // ۸. دسته‌بندی یا تگ موضوعی
    tags: {
      type: String,
      enum: ["AI", "Human", "Assisted", "Verified", "Comprehensive", "Strategy", "Leadership"],
      default: "Human",
    },

    // ۹. نویسنده مقاله
    author: {
      type: String,
      default: "Javad Nasr",
      trim: true,
    },
  },
  {
    timestamps: true, // اضافه شدن خودکار createdAt و updatedAt
    versionKey: false,
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
