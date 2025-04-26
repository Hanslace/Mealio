const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

// Protected routes
router.get('/profile', authMiddleware(), userController.getProfile);
router.put('/profile', authMiddleware(), userController.updateProfile);

module.exports = router;
