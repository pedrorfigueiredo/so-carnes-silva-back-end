const Item = require("../models/items");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.FS_NAME,
  api_key: process.env.FS_KEY,
  api_secret: process.env.FS_SECRET,
});

module.exports = {
  async getAll(req, res, next) {
    Item.find({}, (err, items) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(items);
      }
    });
  },

  async getFromCategory(req, res) {
    Item.find({ category: req.params.categoryId }, (err, items) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(items);
      }
    });
  },

  async create(req, res) {
    if (req.file) {
      await cloudinary.uploader.upload(
        req.file.path,
        { folder: "so-carnes-silva" },
        async (err, result) => {
          if (err) {
            fs.unlinkSync(req.file.path, (err) => {
              res.status(500).json(err);
              return;
            });
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
              url: result.secure_url,
            },
            unit: req.body.unit,
            optionsList: JSON.parse(req.body.optionsList),
          });

          await item.save((err) => {
            if (err) {
              res.status(500).json(err);
              return;
            }
            fs.unlinkSync(req.file.path, (err) => {
              res.status(500).json(err);
              return;
            });
            res.status(201).json(item);
            return;
          });
        }
      );
    } else {
      const item = new Item({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: parseFloat(req.body.price),
        image: null,
        unit: req.body.unit,
        optionsList: JSON.parse(req.body.optionsList),
      });

      await item.save((err) => {
        if (err) {
          res.status(500).json(err);
          return;
        }
        res.status(201).json(item);
      });
    }
  },
};
