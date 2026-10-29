const articlesModel = require("../../models/articles.js");
const { articlesValidationSchema } = require("./articles.validator.js");
const { errorResponse, successResponse } = require("../../utils/responses.js");
const { isValidObjectId } = require("mongoose");

exports.create = async (req, res, next) => {
  try {
    const { title, description, summary, status, tags } = req.body;

    await articlesValidationSchema.validate(
      { title, description, summary, status, tags },
      { abortEarly: false }
    );

    const isArticleExist = await articlesModel.findOne({ title: title.trim() });
    if (isArticleExist) {
      return errorResponse(res, 409, "Article already exists.");
    }

    const picture = req.file ? req.file.filename : null;

    const article = await articlesModel.create({
      title,
      description,
      summary,
      status,
      tags,
      picture,
    });

    return successResponse(res, 201, {
      message: "Article created successfully.",
      article,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const articles = await articlesModel.find().sort({ createdAt: -1 });

    const result = articles.map((article) => ({
      ...article.toObject(),
      picture: article.picture ? `/uploads/${article.picture}` : null,
    }));

    return successResponse(res, 200, {
      articles: result,
    });
  } catch (err) {
    next(err);
  }
};

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

    return successResponse(res, 200, {
      message: "The article was successfully deleted.",
      article,
    });
  } catch (error) {
    next(error);
  }
};