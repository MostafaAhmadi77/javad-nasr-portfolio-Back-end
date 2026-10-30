const fs = require("fs");
const path = require("path");
const { isValidObjectId } = require("mongoose");
const Article = require("../../models/articles.js");
const {
  articlesValidationSchema,
  updateArticleValidationSchema,
} = require("./articles.validator.js");
const { errorResponse, successResponse } = require("../../utils/responses.js");

// مسیر پوشه ذخیره عکس‌ها
const uploadDir = path.resolve(__dirname, "../../../public/uploads/articles");

// تابع کمکی برای استخراج فایل‌های آپلود شده از درخواست
function getUploadedFiles(req) {
  if (Array.isArray(req.files)) {
    return req.files;
  }
  if (req.files && typeof req.files === "object") {
    return [
      ...(req.files.pictures || []),
      ...(req.files.picture || []),
    ];
  }
  if (req.file) {
    return [req.file];
  }
  return [];
}

// تابع کمکی برای حذف یک فایل از روی حافظه سرور
function deleteFileByUrl(fileUrl) {
  if (!fileUrl) return;
  const filename = path.basename(fileUrl);
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("خطا در حذف فایل:", err.message);
    }
  }
}

// تابع کمکی برای حذف تمام فایل‌های تازه آپلود شده در صورت وقوع خطا
function cleanupUploadedFiles(files) {
  if (!files || !files.length) return;
  files.forEach((file) => {
    deleteFileByUrl(file.filename);
  });
}

// تابع محاسبه خودکار مدت زمان مطالعه مقاله (بر اساس ۲۰۰ کلمه در دقیقه)
function calculateReadingTime(text) {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// تابع آماده‌سازی خروجی مقاله برای فرانت‌اند
function formatArticle(articleDoc) {
  const article = articleDoc.toObject ? articleDoc.toObject() : articleDoc;
  const pictures = Array.isArray(article.pictures) ? article.pictures : [];

  // عکس اول برای استفاده سریع فرانت
  const primaryPicture = pictures.length > 0 ? pictures[0].url : article.picture || null;

  return {
    ...article,
    pictures,
    picture: primaryPicture,
    // ایجاد فیلد readTime برای هماهنگی مستقیم با فرانت پروژه
    readTime: article.readingTime || "3 min read",
  };
}

// ==========================================
// ۱. ایجاد مقاله جدید (Create Article)
// ==========================================
exports.create = async (req, res, next) => {
  const uploadedFiles = getUploadedFiles(req).slice(0, 2);

  try {
    const { title, description, summary, status, tags, readingTime, author } = req.body;

    // مرحله ۱: اعتبارسنجی ورودی‌ها با Yup
    try {
      await articlesValidationSchema.validate(
        { title, description, summary, status, tags, readingTime, author },
        { abortEarly: false }
      );
    } catch (validationErr) {
      cleanupUploadedFiles(uploadedFiles);
      return next(validationErr);
    }

    // مرحله ۲: بررسی تکراری نبودن عنوان مقاله
    const isExist = await Article.findOne({ title: title.trim() });
    if (isExist) {
      cleanupUploadedFiles(uploadedFiles);
      return errorResponse(res, 409, "مقاله‌ای با این عنوان قبلاً ثبت شده است.");
    }

    // مرحله ۳: ساخت آرایه تصاویر با رعایت ترتیب دقیق (order: 1 و order: 2)
    const pictures = uploadedFiles.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      order: index + 1, // تصویر اول = 1 (Hero/Cover)، تصویر دوم = 2 (In-content)
    }));

    // مرحله ۴: تعیین مدت زمان خواندن (دستی یا خودکار)
    const finalReadingTime =
      readingTime && readingTime.trim()
        ? readingTime.trim()
        : calculateReadingTime(description);

    // مرحله ۵: ذخیره در پایگاه داده MongoDB
    const article = await Article.create({
      title: title.trim(),
      description: description.trim(),
      summary: summary.trim(),
      readingTime: finalReadingTime,
      pictures,
      picture: pictures.length > 0 ? pictures[0].url : null,
      status: status ? status.trim() : "DRAFT",
      tags: tags ? tags.trim() : "Human",
      author: author ? author.trim() : "Javad Nasr",
    });

    return successResponse(res, 201, {
      message: "مقاله با موفقیت ایجاد شد.",
      article: formatArticle(article),
    });
  } catch (err) {
    cleanupUploadedFiles(uploadedFiles);
    next(err);
  }
};

// ==========================================
// ۲. دریافت همه مقالات (Get All Articles)
// ==========================================
exports.getAll = async (req, res, next) => {
  try {
    const { status, tags, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (tags) filter.tags = tags;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const articles = await Article.find(filter).sort({ createdAt: -1 });

    const formattedArticles = articles.map(formatArticle);

    return successResponse(res, 200, {
      articles: formattedArticles,
      count: formattedArticles.length,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ۳. دریافت یک مقاله با شناسه (Get Article by ID)
// ==========================================
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "شناسه مقاله نامعتبر است.");
    }

    const article = await Article.findById(id);
    if (!article) {
      return errorResponse(res, 404, "مقاله‌ای با این شناسه یافت نشد.");
    }

    return successResponse(res, 200, {
      article: formatArticle(article),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// ۴. ویرایش مقاله (Update Article)
// ==========================================
exports.update = async (req, res, next) => {
  const uploadedFiles = getUploadedFiles(req).slice(0, 2);

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      cleanupUploadedFiles(uploadedFiles);
      return errorResponse(res, 422, "شناسه مقاله نامعتبر است.");
    }

    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      cleanupUploadedFiles(uploadedFiles);
      return errorResponse(res, 404, "مقاله‌ای با این شناسه یافت نشد.");
    }

    const { title, description, summary, status, tags, readingTime, author } = req.body;

    // اعتبارسنجی فیلدهای ارسالی
    const fieldsToValidate = {};
    if (title !== undefined) fieldsToValidate.title = title;
    if (description !== undefined) fieldsToValidate.description = description;
    if (summary !== undefined) fieldsToValidate.summary = summary;
    if (status !== undefined) fieldsToValidate.status = status;
    if (tags !== undefined) fieldsToValidate.tags = tags;
    if (readingTime !== undefined) fieldsToValidate.readingTime = readingTime;
    if (author !== undefined) fieldsToValidate.author = author;

    try {
      await updateArticleValidationSchema.validate(fieldsToValidate, {
        abortEarly: false,
      });
    } catch (validationErr) {
      cleanupUploadedFiles(uploadedFiles);
      return next(validationErr);
    }

    // بررسی عنوان تکراری
    if (title && title.trim() !== existingArticle.title) {
      const duplicate = await Article.findOne({
        title: title.trim(),
        _id: { $ne: id },
      });
      if (duplicate) {
        cleanupUploadedFiles(uploadedFiles);
        return errorResponse(res, 409, "مقاله‌ای با این عنوان از قبل وجود دارد.");
      }
    }

    // آماده‌سازی داده‌های جدید برای به‌روزرسانی
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (summary !== undefined) updateData.summary = summary.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status.trim();
    if (tags !== undefined) updateData.tags = tags.trim();
    if (author !== undefined) updateData.author = author.trim();

    if (readingTime !== undefined) {
      updateData.readingTime = readingTime.trim();
    } else if (description !== undefined) {
      updateData.readingTime = calculateReadingTime(description);
    }

    // در صورت آپلود تصاویر جدید، تصاویر قدیمی را پاک کرده و تصاویر جدید را قرار می‌دهیم
    if (uploadedFiles.length > 0) {
      // حذف عکس‌های قدیمی
      if (existingArticle.pictures && existingArticle.pictures.length > 0) {
        existingArticle.pictures.forEach((pic) => deleteFileByUrl(pic.url));
      } else if (existingArticle.picture) {
        deleteFileByUrl(existingArticle.picture);
      }

      // تنظیم عکس‌های جدید با ترتیب
      const newPictures = uploadedFiles.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        order: index + 1,
      }));

      updateData.pictures = newPictures;
      updateData.picture = newPictures[0].url;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return successResponse(res, 200, {
      message: "مقاله با موفقیت ویرایش شد.",
      article: formatArticle(updatedArticle),
    });
  } catch (err) {
    cleanupUploadedFiles(uploadedFiles);
    next(err);
  }
};

// ==========================================
// ۵. حذف مقاله (Delete Article)
// ==========================================
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "شناسه مقاله نامعتبر است.");
    }

    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return errorResponse(res, 404, "مقاله‌ای با این شناسه یافت نشد.");
    }

    // حذف تمامی عکس‌های مقاله از حافظه سرور
    if (article.pictures && article.pictures.length > 0) {
      article.pictures.forEach((pic) => deleteFileByUrl(pic.url));
    } else if (article.picture) {
      deleteFileByUrl(article.picture);
    }

    return successResponse(res, 200, {
      message: "مقاله و تصاویر آن با موفقیت حذف شدند.",
      article: formatArticle(article),
    });
  } catch (error) {
    next(error);
  }
};
