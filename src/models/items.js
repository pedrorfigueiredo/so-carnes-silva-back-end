const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  newPrice: {type: Number},
  unit: {type: String, required: true},
  image: {
    id: {type: String},
    url: {type: String}
  },
  optionsList: [
    {
      id: {type: String},
      title: {type: String},
      options: {type: Array}
    }
  ],
  available: {type: Boolean},
});

module.exports = mongoose.model("Item", itemSchema);