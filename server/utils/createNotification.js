// server/utils/createNotification.js
const Notification = require('../models/Notification');

/**
 * A reusable function to create and emit notifications.
 * @param {object} io - The Socket.IO server instance.
 * @param {object} userSocketMap - The map of online users.
 * @param {object} details - The notification details.
 * @param {string} details.recipient - The ID of the user receiving the notification.
 * @param {string} details.sender - The ID of the user who triggered the notification.
 * @param {string} details.type - The type of notification ('like', 'comment', etc.).
 * @param {string} [details.post] - The optional ID of the related post.
 */
const createNotification = async (io, userSocketMap, { recipient, sender, type, post }) => {
    try {
        // CRITICAL: Do not create a notification if a user is interacting with their own content.
        if (recipient.toString() === sender.toString()) {
            return;
        }

        // For chat notifications, we use a smart "upsert" to avoid spam.
        if (type === 'chat') {
            // Find and update one, or create it if it doesn't exist.
            // This ensures only one "new message" notification per user.
            await Notification.findOneAndUpdate(
                { recipient, sender, type: 'chat' },
                { $set: { read: false }, $inc: { __v: 1 } }, // Re-mark as unread and update timestamp
                { upsert: true, new: true }
            );
        } else {
            // For all other types, create a new notification every time.
            const notification = new Notification({ recipient, sender, type, post });
            await notification.save();
        }

        // Get a fresh count of all unread notifications for the recipient.
        const unreadCount = await Notification.countDocuments({ recipient, read: false });

        // Find the recipient's socket ID if they are online.
        const recipientSocketId = userSocketMap[recipient.toString()];
        if (recipientSocketId) {
            // If they are online, send a real-time event with the new unread count.
            // We'll also tell the client to refetch its notification list.
            io.to(recipientSocketId).emit('newNotification', { unreadCount });
        }
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

module.exports = createNotification;