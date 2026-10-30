const yup = require("yup");

// Validation schema for creating a new article
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
    .min(20, "Summary must be at least 20 characters long.")
    .max(300, "Summary must not exceed 300 characters.")
    .required("Summary is required."),

  description: yup
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long.")
    .max(10000, "Description must not exceed 10000 characters.")
    .required("Description is required."),

  readingTime: yup
    .string()
    .trim()
    .max(30, "Reading time must not exceed 30 characters.")
    .optional(),

  status: yup
    .string()
    .trim()
    .oneOf(["PUBLISHED", "DRAFT"], "Status must be either PUBLISHED or DRAFT.")
    .optional(),

  tags: yup
    .string()
    .trim()
    .optional(),

  author: yup
    .string()
    .trim()
    .optional(),
});

// Validation schema for updating an existing article
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
    .min(20, "Summary must be at least 20 characters long.")
    .max(300, "Summary must not exceed 300 characters.")
    .optional(),

  description: yup
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long.")
    .max(10000, "Description must not exceed 10000 characters.")
    .optional(),

  readingTime: yup
    .string()
    .trim()
    .max(30, "Reading time must not exceed 30 characters.")
    .optional(),

  status: yup
    .string()
    .trim()
    .oneOf(["PUBLISHED", "DRAFT"], "Status must be either PUBLISHED or DRAFT.")
    .optional(),

  tags: yup
    .string()
    .trim()
    .optional(),

  author: yup
    .string()
    .trim()
    .optional(),
});
