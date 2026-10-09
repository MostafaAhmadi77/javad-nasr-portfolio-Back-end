const yup = require("yup")

exports.articlesValidationSchema = yup.object({
    title: yup.string().min(3,"cevevev").max(128).required("rrbrbrbrbrbrb "),
    description: yup.string().min(40).max(2000).required()
})