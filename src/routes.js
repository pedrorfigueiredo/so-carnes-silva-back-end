const express = require("express");
const ItemsController = require("./controllers/itemsController");
const router = express.Router();
const fileUpload = require('./middleware/file-upload')

router.get("/api/items", ItemsController.getAll);
router.get("/api/items/:categoryId", ItemsController.getFromCategory);
router.post("/api/items", fileUpload.single('image'), ItemsController.create);

module.exports = router;