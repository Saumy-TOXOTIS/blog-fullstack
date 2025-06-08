// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.delete('/me', userController.deleteProfile);

router.get('/me', userController.getProfile);

router.get('/', userController.getAllUsers);

router.put('/me', userController.updateProfile);

router.get('/:id', userController.getUserProfile);

module.exports = router;