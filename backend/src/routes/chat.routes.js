const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

// Create or get existing chat room
router.post('/room', authMiddleware(), chatController.createOrGetRoom);
// Send a message
router.post('/message', authMiddleware(), chatController.sendMessage);
// Fetch messages
router.get('/:roomId/messages', authMiddleware(), chatController.getMessages);

module.exports = router;
