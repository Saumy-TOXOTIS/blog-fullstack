// server/controllers/notificationController.js
const Notification = require('../models/Notification');

// Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId })
            .populate('sender', 'username avatar')
            .populate('post', 'title') // Populate the title of the related post
            .sort({ createdAt: -1 })
            .limit(30); // Limit to the most recent 30 notifications

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications.' });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.userId, read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ message: 'All notifications marked as read.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notifications as read.' });
    }
};

// Clear a specific chat notification
exports.clearChatNotification = async (req, res) => {
    try {
        await Notification.deleteOne({
            recipient: req.userId,
            sender: req.params.senderId,
            type: 'chat',
        });
        res.status(200).json({ message: 'Chat notification cleared.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear chat notification.' });
    }
};