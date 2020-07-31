const mongoose = require('mongoose');

// create mongoDB data schema for posts
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  content2: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Post', postSchema);

