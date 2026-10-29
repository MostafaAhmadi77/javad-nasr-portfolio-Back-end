const express = require("express");
const router = express.Router();
const controller = require("./articles.controller.js");
const upload = require("../../middlewares/uploader.js");

// روت‌های مربوط به مجموعه مقالات
router
  .route("/")
  .get(controller.getAll) // دریافت همه مقالات
  .post(upload.single("picture"), controller.create); // ایجاد مقاله جدید با عکس اختیاری

// روت‌های مربوط به یک مقاله خاص بر اساس شناسه (ID)
router
  .route("/:id")
  .get(controller.getOne) // دریافت یک مقاله
  .put(upload.single("picture"), controller.update) // ویرایش مقاله
  .patch(upload.single("picture"), controller.update) // ویرایش جزئی مقاله
  .delete(controller.remove); // حذف مقاله بر اساس استاندارد REST

// روت قدیمی حذف جهت حفظ سازگاری (Backward Compatibility)
router.delete("/:id/remove", controller.remove);

module.exports = router;
