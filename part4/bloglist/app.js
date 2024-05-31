const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogRouter = require('./controllers/blogs');

const mongoUrl = 'mongodb://localhost/bloglist';
mongoose
  .connect(mongoUrl)
  .then((result) => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);

module.exports = app;
