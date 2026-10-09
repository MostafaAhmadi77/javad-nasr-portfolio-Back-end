const yup = require("yup");

exports.articlesValidationSchema = yup.object({
    title: yup
        .string()
        .min(3, "Title must be at least 3 characters long.")
        .max(128, "Title must not exceed 128 characters.")
        .required("Title is required."),

    description: yup
        .string()
        .min(40, "Description must be at least 40 characters long.")
        .max(2000, "Description must not exceed 2000 characters.")
        .required("Description is required.")
});