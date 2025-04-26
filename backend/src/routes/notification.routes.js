const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');

router.use(authMiddleware());
router.post('/', notificationController.createNotification);
router.get('/:userId', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;
