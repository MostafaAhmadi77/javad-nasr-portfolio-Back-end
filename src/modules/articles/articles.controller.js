const articlesModel = require("./../../models/articles.js")
const { articlesValidationSchema } = require("./articles.validator.js")
const { errorResponse, successResponse } = require("./../../utils/responses.js")

exports.create = async (req, res, next) => {
    try {
        const { title, description, picture } = req.body

        await articlesValidationSchema.validate({
            title,
            description,
            picture
        })

        const isArticlesExist = await articlesModel.findOne({ title })
        if (isArticlesExist) {
            return errorResponse(res, 409, "Article already exists.")
        }

        let articles = new articlesModel({ title, description, picture })
        articles = await articles.save()

        return successResponse(res, 201, { message: "Create articles successfully...", articles: { ...articles.toObject() } })

    } catch (err) {
        next(err)
    }
}