const fs = require("fs");
const path = require("path");
const { isValidObjectId } = require("mongoose");
const Article = require("../../models/articles.js");
const {
  articlesValidationSchema,
  updateArticleValidationSchema,
} = require("./articles.validator.js");
const { errorResponse, successResponse } = require("../../utils/responses.js");

// Path to the uploads directory
const uploadDir = path.resolve(__dirname, "../../../public/uploads/articles");

// Helper: Get array of uploaded files from request
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

// Helper: Safely delete a file from disk
function deleteFileByUrl(fileUrl) {
  if (!fileUrl) return;
  const filename = path.basename(fileUrl);
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error deleting file:", err.message);
    }
  }
}

// Helper: Clean up freshly uploaded files when an error occurs
function cleanupUploadedFiles(files) {
  if (!files || !files.length) return;
  files.forEach((file) => {
    deleteFileByUrl(file.filename);
  });
}

// Helper: Calculate estimated reading time based on 200 words per minute
function calculateReadingTime(text) {
  if (!text) return "1 min read";
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

// Helper: Format article object for frontend compatibility
function formatArticle(articleDoc) {
  const article = articleDoc.toObject ? articleDoc.toObject() : articleDoc;
  const pictures = Array.isArray(article.pictures) ? article.pictures : [];

  // Primary cover image for quick access
  const primaryPicture = pictures.length > 0 ? pictures[0].url : article.picture || null;

  return {
    ...article,
    pictures,
    picture: primaryPicture,
    readTime: article.readingTime || "3 min read",
  };
}

// ==========================================
// 1. Create a new article
// ==========================================
exports.create = async (req, res, next) => {
  const uploadedFiles = getUploadedFiles(req).slice(0, 2);

  try {
    const { title, description, summary, status, tags, readingTime, author } = req.body;

    // Step 1: Validate input fields
    try {
      await articlesValidationSchema.validate(
        { title, description, summary, status, tags, readingTime, author },
        { abortEarly: false }
      );
    } catch (validationErr) {
      cleanupUploadedFiles(uploadedFiles);
      return next(validationErr);
    }

    // Step 2: Check if article title already exists
    const isExist = await Article.findOne({ title: title.trim() });
    if (isExist) {
      cleanupUploadedFiles(uploadedFiles);
      return errorResponse(res, 409, "Article with this title already exists.");
    }

    // Step 3: Create ordered pictures array (order: 1 for Cover, order: 2 for In-content)
    const pictures = uploadedFiles.map((file, index) => ({
      url: `/uploads/${file.filename}`,
      order: index + 1,
    }));

    // Step 4: Determine reading time (custom or auto-calculated)
    const finalReadingTime =
      readingTime && readingTime.trim()
        ? readingTime.trim()
        : calculateReadingTime(description);

    // Step 5: Save article to MongoDB
    const article = await Article.create({
      title: title.trim(),
      description: description.trim(),
      summary: summary.trim(),
      readingTime: finalReadingTime,
      pictures,
      picture: pictures.length > 0 ? pictures[0].url : null,
      status: status ? status.trim() : "DRAFT",
      tags: tags ? tags.trim() : "Strategy",
      author: author ? author.trim() : "Javad Nasr",
    });

    return successResponse(res, 201, {
      message: "Article created successfully.",
      article: formatArticle(article),
    });
  } catch (err) {
    cleanupUploadedFiles(uploadedFiles);
    next(err);
  }
};

// ==========================================
// 2. Get all articles
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
// 3. Get single article by ID
// ==========================================
exports.getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "The entered ID is invalid.");
    }

    const article = await Article.findById(id);
    if (!article) {
      return errorResponse(res, 404, "No article with this ID was found.");
    }

    return successResponse(res, 200, {
      article: formatArticle(article),
    });
  } catch (err) {
    next(err);
  }
};

// ==========================================
// 4. Update article by ID
// ==========================================
exports.update = async (req, res, next) => {
  const uploadedFiles = getUploadedFiles(req).slice(0, 2);

  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      cleanupUploadedFiles(uploadedFiles);
      return errorResponse(res, 422, "The entered ID is invalid.");
    }

    const existingArticle = await Article.findById(id);
    if (!existingArticle) {
      cleanupUploadedFiles(uploadedFiles);
      return errorResponse(res, 404, "No article with this ID was found.");
    }

    const { title, description, summary, status, tags, readingTime, author } = req.body;

    // Validate fields to update
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

    // Check for duplicate title
    if (title && title.trim() !== existingArticle.title) {
      const duplicate = await Article.findOne({
        title: title.trim(),
        _id: { $ne: id },
      });
      if (duplicate) {
        cleanupUploadedFiles(uploadedFiles);
        return errorResponse(res, 409, "Article with this title already exists.");
      }
    }

    // Build update object
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

    // If new images are uploaded, delete old images and save new ones with ordering
    if (uploadedFiles.length > 0) {
      if (existingArticle.pictures && existingArticle.pictures.length > 0) {
        existingArticle.pictures.forEach((pic) => deleteFileByUrl(pic.url));
      } else if (existingArticle.picture) {
        deleteFileByUrl(existingArticle.picture);
      }

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
      message: "Article updated successfully.",
      article: formatArticle(updatedArticle),
    });
  } catch (err) {
    cleanupUploadedFiles(uploadedFiles);
    next(err);
  }
};

// ==========================================
// 5. Delete article by ID
// ==========================================
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return errorResponse(res, 422, "The entered ID is invalid.");
    }

    const article = await Article.findByIdAndDelete(id);
    if (!article) {
      return errorResponse(res, 404, "No article with this ID was found.");
    }

    // Delete associated image files from disk
    if (article.pictures && article.pictures.length > 0) {
      article.pictures.forEach((pic) => deleteFileByUrl(pic.url));
    } else if (article.picture) {
      deleteFileByUrl(article.picture);
    }

    return successResponse(res, 200, {
      message: "The article and its pictures were successfully deleted.",
      article: formatArticle(article),
    });
  } catch (error) {
    next(error);
  }
};
