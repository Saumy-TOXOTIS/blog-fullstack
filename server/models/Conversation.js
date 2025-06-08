// server/models/Conversation.js
const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  // participants will contain the User IDs of the people in the conversation.
  // For a 1-on-1 chat, it will always be an array of two IDs.
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],

  // A direct reference to the last message sent in this conversation.
  // This is a great optimization for the conversation list UI,
  // so we don't have to do a separate query to show a preview.
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },

  // An array of User IDs for users who have "hidden" this conversation
  // from their chat list. This allows one user to hide it without
  // it disappearing for the other user.
  hiddenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  // `timestamps: true` automatically adds `createdAt` and `updatedAt` fields.
  // `updatedAt` is perfect for sorting conversations by the most recent activity.
  timestamps: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);