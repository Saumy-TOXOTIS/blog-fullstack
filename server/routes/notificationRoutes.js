// server/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

// All notification routes are protected
router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.post('/read', notificationController.markAllAsRead);
router.delete('/chat/:senderId', notificationController.clearChatNotification);

module.exports = router;