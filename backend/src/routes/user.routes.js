const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

router.use(authMiddleware());

// Protected routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

module.exports = router;
