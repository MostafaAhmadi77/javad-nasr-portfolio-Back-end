const articlesModel = require("./../../models/articles.js")
const { articlesValidationSchema } = require("./articles.validator.js")
const { errorResponse, successResponse } = require("./../../utils/responses.js")

exports.create = async (req, res, next) => {
    try {
        const { title, description, picture, summary } = req.body

        await articlesValidationSchema.validate({
            title,
            description,
            summary,
            picture
        }, { abortEarly: false })

        const isArticleExist = await articlesModel.findOne({ title })
        if (isArticleExist) {
            return errorResponse(res, 409, "Article already exists.")
        }

        let article = new articlesModel({ title, description, picture, summary })
        article = await article.save()

        return successResponse(res, 201, {
            message: "Article created successfully.",
            article
        });
    } catch (err) {
        next(err)
    }
}