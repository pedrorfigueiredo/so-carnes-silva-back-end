const express = require("express");
const ItemsController = require("./controllers/itemsController");
const router = express.Router();
const fileUpload = require('./middleware/file-upload')

router.get("/api/items", ItemsController.getAll);
router.post("/api/items", fileUpload.single('image'), ItemsController.create);
router.get("/api/items/:id", ItemsController.getById);
router.delete("/api/items/:id", ItemsController.remove);
router.patch("/api/items/:id", fileUpload.single('image'), ItemsController.update);
router.get("/api/items/category/:id", ItemsController.getFromCategory);

module.exports = router;