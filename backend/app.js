const express = require('express');

const app = express();

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
  res.status(200).json(posts);
})

module.exports = app;
