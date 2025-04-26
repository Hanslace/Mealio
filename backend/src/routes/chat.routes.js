const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

router.use(authMiddleware());

// Create or get existing chat room
router.post('/room',chatController.createOrGetRoom);
// Send a message
router.post('/message',  chatController.sendMessage);
// Fetch messages
router.get('/:roomId/messages',  chatController.getMessages);

module.exports = router;
