// src/controllers/notification.controller.js
const db = require('../models');
const Notification = db.Notification;
const User = db.User;
const { Expo } = require('expo-server-sdk');
const expo = new Expo(); // 🔥 Create expo push server

exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, body, type } = req.body;

    // 1️⃣ Save Notification in DB
    const notification = await Notification.create({ user_id, title, body, type });

    const io = req.app.get('io');

    // 2️⃣ Emit real-time notification via socket.io
    io.to(`user_${user_id}`).emit('new_notification', notification);

    // 3️⃣ Update and emit unread count
    const unreadCount = await Notification.count({
      where: { user_id, is_read: false }
    });
    io.to(`user_${user_id}`).emit('notification_count', { unreadCount });

    // 4️⃣ Send Push Notification via Expo
    const user = await User.findByPk(user_id);

    if (user && user.push_token && Expo.isExpoPushToken(user.push_token)) {
      await expo.sendPushNotificationsAsync([
        {
          to: user.push_token,
          sound: 'default',
          title,
          body,
          data: { type }, // extra data if needed
        }
      ]);
    }

    res.status(201).json(notification);

  } catch (err) {
    console.error('Error in createNotification:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // 1️⃣ Find notification to know user_id
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // 2️⃣ Mark as read
    await Notification.update({ is_read: true }, { where: { notification_id: notificationId } });

    const io = req.app.get('io');

    // 3️⃣ Update and emit new unread count
    const unreadCount = await Notification.count({
      where: { user_id: notification.user_id, is_read: false }
    });

    io.to(`user_${notification.user_id}`).emit('notification_count', { unreadCount });

    res.json({ message: 'Notification marked as read' });

  } catch (err) {
    console.error('Error in markAsRead:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.params.userId;

    const notifications = await Notification.findAll({
      where: { user_id },
      order: [['sent_at', 'DESC']]
    });

    res.json(notifications);

  } catch (err) {
    console.error('Error in getNotifications:', err);
    res.status(500).json({ error: err.message });
  }
};
