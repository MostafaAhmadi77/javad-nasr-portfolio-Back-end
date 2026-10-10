const yup = require("yup");

exports.articlesValidationSchema = yup.object({
    title: yup
        .string()
        .min(3, "Title must be at least 3 characters long.")
        .max(128, "Title must not exceed 128 characters.")
        .required("Title is required."),

    description: yup
        .string()
        .min(50, "Description must be at least 50 characters long.")
        .max(2000, "Description must not exceed 2000 characters.")
        .required("Description is required."),

    summary: yup
        .string()
        .min(50, "Summery must be at least 50 characters long.")
        .max(250, "Summery must not exceed 250 characters.")
        .required("Summery is required.")
});