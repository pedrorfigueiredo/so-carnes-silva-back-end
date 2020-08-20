const Item = require("../models/items");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.FS_NAME,
  api_key: process.env.FS_KEY,
  api_secret: process.env.FS_SECRET
});

module.exports = {
  async getAll(req, res) {
    Item.find({}, (err, items) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(201).json(items);
      }
    });
  },

  async getFromCategory(req, res) {
    Item.find({ category: req.params.categoryId }, (err, items) => {
      if (err) {
        res.status(500).json(err);
        console.log(err);
      } else {
        res.status(201).json(items);
        console.log(items);
      }
    });
  },

  create(req, res) {
    cloudinary.uploader.upload(req.file.path, {folder: "so-carnes-silva"}, async (err, result) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      const item = new Item({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: parseFloat(req.body.price),
        image: {
          id: result.public_id,
          url: result.secure_url
        },
        unit: req.body.unit,
        optionsList: JSON.parse(req.body.optionsList),
      });
  
      await item.save((err) => {
        if (err) {
          res.status(500).json(err);
        }
        res.status(201).json(item);
      });
    });
  },
};
