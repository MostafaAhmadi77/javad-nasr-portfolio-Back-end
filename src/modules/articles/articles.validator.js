const yup = require("yup");

// اعتبارسنجی داده‌ها هنگام ایجاد مقاله جدید (Create)
exports.articlesValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "عنوان مقاله باید حداقل ۳ کاراکتر باشد.")
    .max(128, "عنوان مقاله نباید بیشتر از ۱۲۸ کاراکتر باشد.")
    .required("عنوان مقاله الزامی است."),

  summary: yup
    .string()
    .trim()
    .min(20, "خلاصه مقاله باید حداقل ۲۰ کاراکتر باشد.")
    .max(300, "خلاصه مقاله نباید بیشتر از ۳۰۰ کاراکتر باشد.")
    .required("خلاصه مقاله الزامی است."),

  description: yup
    .string()
    .trim()
    .min(20, "متن مقاله باید حداقل ۲۰ کاراکتر باشد.")
    .max(10000, "متن مقاله نباید بیشتر از ۱۰۰۰۰ کاراکتر باشد.")
    .required("متن مقاله الزامی است."),

  readingTime: yup
    .string()
    .trim()
    .max(30, "مدت زمان مطالعه نباید بیش از ۳۰ کاراکتر باشد.")
    .optional(),

  status: yup
    .string()
    .trim()
    .oneOf(["PUBLISHED", "DRAFT"], "وضعیت فقط می‌تواند PUBLISHED یا DRAFT باشد.")
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

// اعتبارسنجی داده‌ها هنگام ویرایش مقاله (Update)
exports.updateArticleValidationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "عنوان مقاله باید حداقل ۳ کاراکتر باشد.")
    .max(128, "عنوان مقاله نباید بیشتر از ۱۲۸ کاراکتر باشد.")
    .optional(),

  summary: yup
    .string()
    .trim()
    .min(20, "خلاصه مقاله باید حداقل ۲۰ کاراکتر باشد.")
    .max(300, "خلاصه مقاله نباید بیشتر از ۳۰۰ کاراکتر باشد.")
    .optional(),

  description: yup
    .string()
    .trim()
    .min(20, "متن مقاله باید حداقل ۲۰ کاراکتر باشد.")
    .max(10000, "متن مقاله نباید بیشتر از ۱۰۰۰۰ کاراکتر باشد.")
    .optional(),

  readingTime: yup
    .string()
    .trim()
    .max(30, "مدت زمان مطالعه نباید بیش از ۳۰ کاراکتر باشد.")
    .optional(),

  status: yup
    .string()
    .trim()
    .oneOf(["PUBLISHED", "DRAFT"], "وضعیت فقط می‌تواند PUBLISHED یا DRAFT باشد.")
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
