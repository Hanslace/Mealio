const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

// All chat routes require auth
router.use(authMiddleware());

// Create or get a chat room between two users
router.post('/room', chatController.createOrGetRoom);

// Fetch all messages for a room
router.get('/room/:roomId/messages', chatController.getMessages);

// (Optional) API Send message (mostly sockets used now, but kept for backup/manual testing)
router.post('/room/:roomId/message', chatController.sendMessage);

module.exports = router;
