require('dotenv').config();
const Item = require('../models/items');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const HttpError = require('../models/http-error');

cloudinary.config({
  cloud_name: process.env.FS_NAME,
  api_key: process.env.FS_KEY,
  api_secret: process.env.FS_SECRET,
});

const getAll = async (req, res, next) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (err) {
    const error = new HttpError('Something wrong. Could not fetch items.', 500);
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    const error = new HttpError(
      'Something wrong. Could not fetch the desired item.',
      500
    );
    return next(error);
  }
};

const getFromCategory = async (req, res, next) => {
  try {
    const items = await Item.find({ category: req.params.id });
    res.status(200).json(items);
  } catch (err) {
    const error = new HttpError('Something wrong. Could not fetch items.', 500);
    return next(error);
  }
};

const create = async (req, res, next) => {
  let result;
  try {
    result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'so-carnes-silva',
    });
    await fs.unlinkSync(req.file.path);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something wrong. Could not upload image to file server.',
      500
    );
    return next(error);
  }

  const item = new Item({
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    image: {
      id: result.public_id,
      url: result.secure_url,
    },
    unit: req.body.unit,
    options: JSON.parse(req.body.options),
  });

  try {
    await item.save();
    res.status(200).json(item);
  } catch (err) {
    const error = new HttpError(
      'Something wrong. Could not save item on database.',
      500
    );
    return next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const response = await Item.findByIdAndDelete(req.params.id);
    await cloudinary.api.delete_resources([response.image.id]);
    res.status(200).json(response);
  } catch (err) {
    const error = new HttpError(
      'Something wrong. Could not delete the item on database.',
      500
    );
    return next(error);
  }
};

const update = async (req, res, next) => {
  let result;
  try {
    result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'so-carnes-silva',
    });
    await fs.unlinkSync(req.file.path);
  } catch (err) {
    const error = new HttpError(
      'Something wrong. Could not upload image to file server.',
      500
    );
    return next(error);
  }

  const item = {
    name: req.body.name,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    image: {
      id: result.public_id,
      url: result.secure_url,
    },
    unit: req.body.unit,
    options: JSON.parse(req.body.options),
  };

  try {
    const response = await Item.findByIdAndUpdate(req.params.id, item, {
      useFindAndModify: false,
    });
    await cloudinary.api.delete_resources([response.image.id]);
    res.status(200).json(item);
  } catch (err) {
    const error = new HttpError(
      'Something wrong. Could not save item on database.',
      500
    );
    return next(error);
  }
};

module.exports = { getAll, getById, getFromCategory, create, remove, update };
