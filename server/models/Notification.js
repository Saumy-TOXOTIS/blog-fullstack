// server/models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    // The user who receives the notification. We'll index this for fast lookups.
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // The user who triggered the notification (e.g., who liked the post).
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // The type of notification. The `enum` provides validation.
    type: {
        type: String,
        enum: ['like', 'comment', 'reply', 'follow', 'chat'],
        required: true,
    },

    // An optional reference to the Post this notification is about.
    // This is relevant for likes, comments, and replies.
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

    // A flag to see if the user has viewed the notification yet.
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Notification', NotificationSchema);