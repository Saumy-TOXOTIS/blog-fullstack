// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// All chat routes are protected
router.use(authMiddleware);

router.get('/conversations', chatController.getConversations);
router.get('/conversations/:conversationId/messages', chatController.getMessages);
router.post('/conversations', chatController.createOrGetConversation);
router.get('/conversations/hidden', chatController.getHiddenConversations);
router.post('/conversations/:conversationId/hide', chatController.hideConversation);
router.post('/conversations/:conversationId/unhide', chatController.unhideConversation);

// --- We will add routes for edit, delete, and hide here later ---

module.exports = router;