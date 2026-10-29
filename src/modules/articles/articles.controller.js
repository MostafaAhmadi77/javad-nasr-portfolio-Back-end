const fs = require("fs");
const path = require("path");
const { isValidObjectId } = require("mongoose");
const articlesModel = require("../../models/articles.js");
const {
  articlesValidationSchema,
  updateArticleValidationSchema,
} = require("./articles.validator.js");
const { errorResponse, successResponse } = require("../../utils/responses.js");

// مسیر پوشه آپلود تصاویر
const uploadDir = path.resolve(__dirname, "../../../public/uploads/articles");

// تابع کمکی برای حذف فایل در صورت وجود (جلوگیری از باقی ماندن فایل‌های بی‌استفاده در سرور)
const deleteFileIfExists = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadDir, path.basename(filename));
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error deleting file:", err.message);
    }
  }
};

// ۱. ایجاد مقاله جدید (Create)
exports.create = async (req, res, next) => {
  try {
    const { title, description, summary, status, tags } = req.body;

    // مرحله ۱: اعتبارسنجی مقادیر با Yup
    try {
      await articlesValidationSchema.validate(
        { title, description, summary, status, tags },
        { abortEarly: false }
      );
    } catch (validationErr) {
      // اگر اعتبارسنجی شکست خورد و فایلی آپلود شده بود، فایل را پاک می‌کنیم
      if (req.file) {
        deleteFileIfExists(req.file.filename);
      }
      return next(validationErr);
    }

    // مرحله ۲: بررسی تکراری نبودن عنوان مقاله
    const isArticleExist = await articlesModel.findOne({
      title: title ? title.trim() : "",
    });
    if (isArticleExist) {
      if (req.file) {
        deleteFileIfExists(req.file.filename);
      }
      return errorResponse(res, 409, "Article already exists.");
    }

    // مرحله ۳: ثبت مقاله در پایگاه داده
    const picture = req.file ? req.file.filename : null;

    const article = await articlesModel.create({
      title: title ? title.trim() : undefined,
      description: description ? description.trim() : undefined,
      summary: summary ? summary.trim() : undefined,
      status: status ? status.trim() : undefined,
      tags: tags ? tags.trim() : undefined,
      picture,
    });

    const result = {
      ...article.toObject(),
      picture: article.picture ? `/uploads/${article.picture}` : null,
    };

    return successResponse(res, 201, {
      message: "Article created successfully.",
      article: result,
    });
  } catch (err) {
    if (req.file) {
      deleteFileIfExists(req.file.filename);
    }
    next(err);
  }
};

// ۲. دریافت تمام مقالات (Get All) با امکان فیلتر و جستجو
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

    const articles = await articlesModel.find(filter).sort({ createdAt: -1 });

    const result = articles.map((article) => ({
      ...article.toObject(),
      picture: article.picture ? `/uploads/${article.picture}` : null,
    }));

    return successResponse(res, 200, {
      articles: result,
      count: result.length,
    });
  } catch (err) {
    next(err);
  }
};

// ۳. دریافت یک مقاله با شناسه (Get One By ID)
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    // بررسی معتبر بودن فرمت شناسه
    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "The entered ID is invalid.");
    }

    const article = await articlesModel.findById(id);
    if (!article) {
      return errorResponse(res, 404, "No article with this ID was found.");
    }

    const result = {
      ...article.toObject(),
      picture: article.picture ? `/uploads/${article.picture}` : null,
    };

    return successResponse(res, 200, {
      article: result,
    });
  } catch (err) {
    next(err);
  }
};

// ۴. ویرایش مقاله (Update By ID)
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      if (req.file) deleteFileIfExists(req.file.filename);
      return errorResponse(res, 422, "The entered ID is invalid.");
    }

    // بررسی وجود مقاله
    const existingArticle = await articlesModel.findById(id);
    if (!existingArticle) {
      if (req.file) deleteFileIfExists(req.file.filename);
      return errorResponse(res, 404, "No article with this ID was found.");
    }

    const { title, description, summary, status, tags } = req.body;

    // اعتبارسنجی فیلدهای ارسالی
    const fieldsToValidate = {};
    if (title !== undefined) fieldsToValidate.title = title;
    if (description !== undefined) fieldsToValidate.description = description;
    if (summary !== undefined) fieldsToValidate.summary = summary;
    if (status !== undefined) fieldsToValidate.status = status;
    if (tags !== undefined) fieldsToValidate.tags = tags;

    try {
      await updateArticleValidationSchema.validate(fieldsToValidate, {
        abortEarly: false,
      });
    } catch (validationErr) {
      if (req.file) deleteFileIfExists(req.file.filename);
      return next(validationErr);
    }

    // بررسی عدم تکراری بودن عنوان جدید
    if (title && title.trim() !== existingArticle.title) {
      const duplicate = await articlesModel.findOne({
        title: title.trim(),
        _id: { $ne: id },
      });
      if (duplicate) {
        if (req.file) deleteFileIfExists(req.file.filename);
        return errorResponse(
          res,
          409,
          "Article with this title already exists."
        );
      }
    }

    // ساخت آبجکت فیلدهای جدید
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (summary !== undefined) updateData.summary = summary.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status.trim();
    if (tags !== undefined) updateData.tags = tags.trim();

    // اگر عکس جدید آپلود شد، عکس قبلی را پاک می‌کنیم
    if (req.file) {
      if (existingArticle.picture) {
        deleteFileIfExists(existingArticle.picture);
      }
      updateData.picture = req.file.filename;
    }

    const updatedArticle = await articlesModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    const result = {
      ...updatedArticle.toObject(),
      picture: updatedArticle.picture
        ? `/uploads/${updatedArticle.picture}`
        : null,
    };

    return successResponse(res, 200, {
      message: "Article updated successfully.",
      article: result,
    });
  } catch (err) {
    if (req.file) deleteFileIfExists(req.file.filename);
    next(err);
  }
};

// ۵. حذف مقاله (Delete By ID)
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "The entered ID is invalid.");
    }

    const article = await articlesModel.findByIdAndDelete(id);
    if (!article) {
      return errorResponse(res, 404, "No article with this ID was found.");
    }

    // حذف فایل عکس مقاله از روی دیسک
    if (article.picture) {
      deleteFileIfExists(article.picture);
    }

    return successResponse(res, 200, {
      message: "The article was successfully deleted.",
      article,
    });
  } catch (error) {
    next(error);
  }
};
