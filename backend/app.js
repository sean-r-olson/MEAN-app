const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const Post = require('./models/post');


app.use(bodyParser.json());

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
})

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  // save new post into db using mongo save method
  post.save().then(createdPost => {
    console.log(createdPost);
    res.status(201).json({
    message: 'post added successfully',
    postId: createdPost._id
  });
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'post updated successfully'
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
    });
  })
});

app.delete('/api/posts/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id
  }).then(result => {
    console.log(result);
    res.status(200).json({
      message: 'post deleted'
    })
  })
});

module.exports = app;
