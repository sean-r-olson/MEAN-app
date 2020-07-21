const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  // create new user and store in db
    // hash/encrypt user's password using bcrypt
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'user created',
          result: result
        })
      }).catch(err => {
        res.status(500).json({
            message: 'Invalid authentication credentials'
        })
      })
    })
});

router.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'authentication failed'
      })
    }
    fetchedUser = user;
    // compare the password entered in the form w/ the password in the db
    return bcrypt.compare(req.body.password, user.password)
  }).then(result => {
    if (!result) {
      return res.status(401).json({
        message: 'authentication failed'
      })
    }
    // create JSON web token for user session if authentication succeeded
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      'secret_this_should_be_longer',
      {expiresIn: '1h',
    });
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    })
  }).catch(err => {
    return res.status(401).json({
      message: 'Invalid authentication credentials'
    })
  })
});

module.exports = router;
