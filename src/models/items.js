const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true },
  image: {
    id: { type: String, required: true },
    url: { type: String, required: true },
  },
  options: [{ type: String }],
  available: { type: Boolean },
});

module.exports = mongoose.model("Item", itemSchema);
