// server/routes/postRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.use(authMiddleware);

router.use('/images', express.static(path.join(__dirname, '../uploads')));

router.post('/', upload, postController.createPost);
router.put('/:id', upload, postController.updatePost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.get('/', postController.getPosts);
router.get('/me', postController.getUserPosts);
router.get('/:id', postController.getPostById);
router.post('/:id/like', postController.toggleLike);
router.delete('/:id', postController.deletePost);

module.exports = router;