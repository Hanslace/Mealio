const { Notification } = require('../models');

exports.createNotification = async (req, res) => {
  try {
    const { user_id, title, body, type } = req.body;

    const notification = await Notification.create({ user_id, title, body, type });

    // Emit socket event
    const io = req.app.get('io');
    io.to(`user_${user_id}`).emit('new_notification', notification);

    res.status(201).json(notification);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.update({ is_read: true }, { where: { notification_id: notificationId } });
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
