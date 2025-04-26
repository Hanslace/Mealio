// src/routes/notification.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const notificationController = require('../controllers/notification.controller');

// All routes below require user to be logged in
router.use(authMiddleware());

// 1️⃣ Create a notification manually (admin, restaurant actions, system triggers etc.)
router.post('/', notificationController.createNotification);

// 2️⃣ Fetch all previous notifications for a user
router.get('/user/:userId', notificationController.getNotifications);

// 3️⃣ Mark a notification as read (to update unread count)
router.put('/:notificationId/mark-read', notificationController.markAsRead);

// 🚀 Real-time: New notifications and unread count updates handled via Socket.IO (no HTTP polling)

module.exports = router;
