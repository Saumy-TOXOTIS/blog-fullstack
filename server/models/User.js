// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '/images/default_profile.jpg' }, // Ensure a default
  createdAt: {
    type: Date,
    default: Date.now
  },
  // New fields for followers/following
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Virtuals for counts
UserSchema.virtual('followerCount').get(function() {
  return this.followers ? this.followers.length : 0;
});

UserSchema.virtual('followingCount').get(function() {
  return this.following ? this.following.length : 0;
});

// Ensure virtuals are included when converting to JSON/Object
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);