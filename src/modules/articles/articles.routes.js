const express = require("express");
const router = express.Router();
const controller = require("./articles.controller.js");
const upload = require("../../middlewares/uploader.js");

// میان‌افزار پذیرش حداکثر ۲ تصویر با نام فیلد pictures یا picture
const uploadPictures = upload.fields([
  { name: "pictures", maxCount: 2 },
  { name: "picture", maxCount: 2 },
]);

// روت‌های مربوط به کل مقالات
router
  .route("/")
  .get(controller.getAll) // دریافت همه مقالات
  .post(uploadPictures, controller.create); // ایجاد مقاله جدید با حداکثر ۲ عکس با ترتیب

// روت‌های مربوط به یک مقاله مشخص بر اساس شناسه
router
  .route("/:id")
  .get(controller.getOne) // دریافت جزئیات مقاله
  .put(uploadPictures, controller.update) // ویرایش مقاله و تصاویر
  .patch(uploadPictures, controller.update) // ویرایش جزئی مقاله
  .delete(controller.remove); // حذف مقاله و تصاویر مربوطه

// روت قدیمی حذف مقاله جهت حفظ سازگاری
router.delete("/:id/remove", controller.remove);

module.exports = router;
