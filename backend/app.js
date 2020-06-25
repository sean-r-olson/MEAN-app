const express = require('express');
const bodyParser = require('body-parser');
const mongoPassword = BRmJHjo5RhEn3xgw;
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Reqested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
})

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'post added successfully'
  });
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'asdf1234',
      title: 'first server side post',
      content: 'this is coming from the server'
  },
  {
    id: 'qwer5678',
    title: 'second server side post',
    content: 'this is also coming from the server'
  }
  ];
  res.status(200).json({
    message: "Posts fetched successfully!",
    posts: posts
  });
})

module.exports = app;
