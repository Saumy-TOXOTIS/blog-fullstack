// server/models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: {
    type: String,
    default: "",
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add a virtual field for like count
PostSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Add a method to check if a user has liked the post
PostSchema.methods.hasLikedBy = function(userId) {
  return this.likes.some(like => like.equals(userId));
};

module.exports = mongoose.model('Post', PostSchema);