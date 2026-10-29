const yup = require("yup");

exports.articlesValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(128, "Title must not exceed 128 characters.")
    .required("Title is required."),

  summary: yup
    .string()
    .trim()
    .min(50, "Summary must be at least 50 characters long.")
    .max(250, "Summary must not exceed 250 characters.")
    .required("Summary is required."),

  description: yup
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters long.")
    .max(2000, "Description must not exceed 2000 characters.")
    .required("Description is required."),

  status: yup
    .string()
    .trim()
    .oneOf(
      ["PUBLISHED", "DRAFT"],
      "Status must be either PUBLISHED or DRAFT."
    )
    .optional(),

  tags: yup
    .string()
    .trim()
    .oneOf(
      ["AI", "Human", "Assisted", "Verified", "Comprehensive"],
      "Invalid tag selected."
    )
    .optional(),
});

exports.updateArticleValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters long.")
    .max(128, "Title must not exceed 128 characters.")
    .optional(),

  summary: yup
    .string()
    .trim()
    .min(50, "Summary must be at least 50 characters long.")
    .max(250, "Summary must not exceed 250 characters.")
    .optional(),

  description: yup
    .string()
    .trim()
    .min(50, "Description must be at least 50 characters long.")
    .max(2000, "Description must not exceed 2000 characters.")
    .optional(),

  status: yup
    .string()
    .trim()
    .oneOf(
      ["PUBLISHED", "DRAFT"],
      "Status must be either PUBLISHED or DRAFT."
    )
    .optional(),

  tags: yup
    .string()
    .trim()
    .oneOf(
      ["AI", "Human", "Assisted", "Verified", "Comprehensive"],
      "Invalid tag selected."
    )
    .optional(),
});
