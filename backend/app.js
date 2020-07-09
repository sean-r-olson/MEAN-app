const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const Post = require('./models/post');

const postsRoutes = require('./routes/posts');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// grant frontend access to images folder
app.use('/images', express.static(path.join('backend/images')));

// connect to mongodb database (node-angular)
mongoose.connect('mongodb+srv://solson34:BRmJHjo5RhEn3xgw@cluster0-zq0ji.mongodb.net/node-angular?retryWrites=true&w=majority')
.then(() => {
  console.log('connected to db');
}).catch(() => {
  console.log('failed to connect to db');
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Reqested-With, Content-Type, Accept, Authorization, Access-Control-Max-Age",
  );
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});



app.use('/api/posts', postsRoutes);

module.exports = app;
