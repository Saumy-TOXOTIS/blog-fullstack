// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.use(authMiddleware);

router.delete('/me', userController.deleteProfile);

router.get('/me', userController.getProfile);

router.get('/', userController.getAllUsers);

router.put('/me', upload, userController.updateProfile);

router.get('/:id', userController.getUserProfile);

module.exports = router;