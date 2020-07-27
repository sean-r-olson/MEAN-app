const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// create mongoDB data schema for users
const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// use uniqueValidator package to throw error when user enters username that already exists
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
