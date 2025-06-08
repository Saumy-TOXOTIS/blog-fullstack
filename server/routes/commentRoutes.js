const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/:postId/comments', commentController.createComment);
router.get('/:postId/comments', commentController.getComments);
router.delete('/:id', commentController.deleteComment);

module.exports = router;