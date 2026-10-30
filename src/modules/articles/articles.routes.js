const express = require("express");
const router = express.Router();
const controller = require("./articles.controller.js");
const upload = require("../../middlewares/uploader.js");

// Accept up to 2 images using field name "pictures" or "picture"
const uploadPictures = upload.fields([
  { name: "pictures", maxCount: 2 },
  { name: "picture", maxCount: 2 },
]);

// Routes for the collection of articles
router
  .route("/")
  .get(controller.getAll) // Retrieve all articles
  .post(uploadPictures, controller.create); // Create an article with up to 2 ordered images

// Routes for a single article by ID
router
  .route("/:id")
  .get(controller.getOne) // Retrieve single article
  .put(uploadPictures, controller.update) // Update article
  .patch(uploadPictures, controller.update) // Partially update article
  .delete(controller.remove); // Delete article and its images

// Legacy delete endpoint for backward compatibility
router.delete("/:id/remove", controller.remove);

module.exports = router;
