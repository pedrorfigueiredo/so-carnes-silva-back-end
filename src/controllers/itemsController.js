const Item = require("../models/items");

module.exports = {
  async getAll(req, res) {
    Item.find({}, (err, items) => {
      if (err) {
        res.status(500).json(err);
        console.log(err);
      } else {
        res.status(201).json(items);
        console.log(items);
      }
    });
  },

  async create(req, res) {
    let buffer = null;
    let mimeType = null;
    if (req.file) {
      buffer = req.file.buffer,
      mimeType = req.file.mimetype
    }

    const item = new Item({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: parseFloat(req.body.price),
      image: buffer,
      mimeType: mimeType,
      unit: req.body.unit,
      optionsList: JSON.parse(req.body.optionsList),
    });

    await item.save((err) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      }
      console.log(item);
      res.status(201).json(item);
    });
  },
};
