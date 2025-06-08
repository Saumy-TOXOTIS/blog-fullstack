// server/routes/followRoutes.js
const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

// All follow-related routes require authentication
router.use(authMiddleware);

router.post('/:userIdToFollow', followController.followUser);
router.delete('/:userIdToUnfollow', followController.unfollowUser);

router.get('/:userId/following', followController.getFollowing);
router.get('/:userId/followers', followController.getFollowers);

module.exports = router;