const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const HttpError = require('./models/http-error');

require('dotenv').config();

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(routes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-sirbp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('SERVER STARTED...');
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
