const { Op } = require('sequelize');
const db      = require('../models');
const User    = db.User;
const Order   = db.Order;
const Restaurant = db.Restaurant;
const DeliveryPersonnel = db.DeliveryPersonnel;
const Notification       = db.Notification;

const sendEmail = require('../utils/sendEmail');  // your nodemailer helper

exports.me = async (req, res, next) => {
  try {
    // req.userId is set by your auth middleware after JWT verify
    const user = await User.findByPk(req.userId, {
      attributes: ['user_id', 'full_name', 'email', 'role']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // send back only the fields you need
    res.json({
      user_id:   user.user_id,
      full_name: user.full_name,
      email:     user.email,
      role:      user.role
    });
  } catch (err) {
    next(err);
  }
};

// ─── Dashboard ───────────────────────────────────────
module.exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const totalUsers       = await User.count();
    const totalRestaurants = await Restaurant.count();
    const totalOrders      = await Order.count();
    const [[{ total_revenue }]] = await db.sequelize.query(
      'SELECT SUM(net_amount) AS total_revenue FROM orders'
    );

    res.json({
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue: total_revenue || 0,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Users ────────────────────────────────────────────
module.exports.listUsers = async (req, res, next) => {
  try {
    const { role } = req.query; // optional filter
    let whereClause = {};
    if (role) {
      whereClause.role = role;
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] }
    });
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

async function notifyUser(user, subject, message, type, io) {
  // 4️⃣ Email
  if (user.email) {
    await sendEmail(user.email, subject, `<p>${message}</p>`);
  }
}

// ─── Ban User ─────────────────────────────────────────
module.exports.banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is_active = false;
    await user.save();

    const subject = 'Your account has been banned';
    const message = 'An administrator has deactivated your account. Please contact support if you believe this is an error.';
    // req.app.get('io') is your Socket.IO server
    await notifyUser(user, subject, message, 'user-ban', req.app.get('io'));

    res.json({ message: `User ${userId} banned.`, user });
  } catch (err) {
    next(err);
  }
};

// ─── Reactivate User ──────────────────────────────────
module.exports.reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is_active = true;
    await user.save();

    const subject = 'Your account has been reactivated';
    const message = 'Good news—an administrator has reactivated your account. You can now log in again.';
    await notifyUser(user, subject, message, 'user-reactivate', req.app.get('io'));

    res.json({ message: `User ${userId} reactivated.`, user });
  } catch (err) {
    next(err);
  }
};

// ─── Restaurants ─────────────────────────────────────
module.exports.listRestaurants = async (req, res, next) => {
  try {
    const { status } = req.query; // e.g. pending, approved, rejected, suspended
    const where = status ? { verification_status: status } : {};
    const list = await Restaurant.findAll({ where });
    res.json(list);
  } catch (err) { next(err); }
};

async function notifyRestaurantOwner(restaurant, subject, message) {

  const owner = await User.findByPk(restaurant.owner_id);
  if (owner?.email) {
    await sendEmail(owner.email, subject, `<p>${message}</p>`);
  }
}

module.exports.approveRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const rest = await Restaurant.findByPk(restaurantId);
    if (!rest) return res.status(404).json({ error: 'Not found' });

    rest.verification_status = 'approved';
    await rest.save();

    const msg = 'Your restaurant has been approved.';
    await notifyRestaurantOwner(rest, 'Restaurant Approved', msg);

    res.json({ message: msg, restaurant: rest });
  } catch (err) { next(err); }
};

module.exports.rejectRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const rest = await Restaurant.findByPk(restaurantId);
    if (!rest) return res.status(404).json({ error: 'Not found' });

    rest.verification_status = 'rejected';
    await rest.save();

    const msg = 'Your restaurant registration has been rejected.';
    await notifyRestaurantOwner(rest, 'Restaurant Rejected', msg);

    res.json({ message: msg, restaurant: rest });
  } catch (err) { next(err); }
};

module.exports.suspendRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const rest = await Restaurant.findByPk(restaurantId);
    if (!rest) return res.status(404).json({ error: 'Not found' });

    rest.status = 'suspended';
    await rest.save();

    const msg = 'Your restaurant has been suspended.';
    await notifyRestaurantOwner(rest, 'Restaurant Suspended', msg);

    res.json({ message: msg, restaurant: rest });
  } catch (err) { next(err); }
};

module.exports.unsuspendRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const rest = await Restaurant.findByPk(restaurantId);
    if (!rest) return res.status(404).json({ error: 'Not found' });

    rest.status = 'closed';
    await rest.save();

    const msg = 'Your restaurant has been reactivated.';
    await notifyRestaurantOwner(rest, 'Restaurant Reactivated', msg);

    res.json({ message: msg, restaurant: rest });
  } catch (err) { next(err); }
};

// ─── Delivery Personnel ───────────────────────────────
module.exports.listDeliveryPersonnel = async (req, res, next) => {
  try {
    const { status } = req.query; // active, not_active, suspended
    const where = status ? { status } : {};
    const list = await DeliveryPersonnel.findAll({ where });
    res.json(list);
  } catch (err) { next(err); }
};



async function notifyDeliveryPerson(dp, subject, message) {
  const user = await User.findByPk(dp.user_id);
  if (user?.email) {
    await sendEmail(user.email, subject, `<p>${message}</p>`);
  }
}

// ─── Delivery Verification ──────────────────────────────────────────
module.exports.verifyProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dp = await DeliveryPersonnel.findByPk(id);
    if (!dp) return res.status(404).json({ error: 'Not found' });
    dp.verification_status = 'approved';
    await dp.save();
    const msg = 'Your delivery profile has been verified.';
    await notifyDeliveryPerson(dp, 'Delivery Profile Verified', msg);
    res.json({ message: msg, profile: dp });
  } catch (err) {
    next(err);
  }
};

module.exports.rejectProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dp = await DeliveryPersonnel.findByPk(id);
    if (!dp) return res.status(404).json({ error: 'Not found' });
    dp.verification_status = 'rejected';
    await dp.save();
    const msg = 'Your delivery profile verification has been rejected.';
    await notifyDeliveryPerson(dp, 'Delivery Profile Rejected', msg);
    res.json({ message: msg, profile: dp });
  } catch (err) {
    next(err);
  }
};


module.exports.suspendDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dp = await DeliveryPersonnel.findByPk(id);
    if (!dp) return res.status(404).json({ error: 'Not found' });

    dp.status = 'suspended';
    await dp.save();

    const msg = 'Your delivery account has been suspended.';
    await notifyDeliveryPerson(dp, 'Delivery Account Suspended', msg);

    res.json({ message: msg, profile: dp });
  } catch (err) { next(err); }
};

module.exports.unsuspendDelivery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dp = await DeliveryPersonnel.findByPk(id);
    if (!dp) return res.status(404).json({ error: 'Not found' });

    dp.status = 'not_active';
    await dp.save();

    const msg = 'Your delivery account has been reactivated.';
    await notifyDeliveryPerson(dp, 'Delivery Account Reactivated', msg);

    res.json({ message: msg, profile: dp });
  } catch (err) { next(err); }
};

// ─── Broadcast Notifications ──────────────────────────
async function broadcast(toList, title, body, type, req) {
  const io = req.app.get('io');

  await Promise.all(
    toList.map(async (user) => {
      // 1️⃣ Save to DB
      const notif = await Notification.create({
        user_id: user.user_id,
        title,
        body,
        type,
      });

      // 2️⃣ Emit real-time via Socket.IO
      io.to(`user_${user.user_id}`).emit('new_notification', notif);

      // 3️⃣ Emit updated unread count
      const unreadCount = await Notification.count({
        where: { user_id: user.user_id, is_read: false }
      });
      io.to(`user_${user.user_id}`).emit('notification_count', { unreadCount });

      // 4️⃣ Send Push via Expo (if they have a valid token)
      if (user.push_token && Expo.isExpoPushToken(user.push_token)) {
        await expo.sendPushNotificationsAsync([{
          to: user.push_token,
          sound: 'default',
          title,
          body,
          data: { type },
        }]);
      }
    })
  );
}

// … in your broadcast endpoints …

module.exports.notifyAllUsers = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const allUsers = await User.findAll({ where: { role: 'customer' } });
    await broadcast(allUsers, title, body, 'broadcast-user', req);
    res.json({ message: 'Notification sent to all users.' });
  } catch (err) { next(err); }
};

module.exports.notifyAllRestaurants = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const owners = await User.findAll({ where: { role: 'restaurant_owner' } });
    await broadcast(owners, title, body, 'broadcast-restaurant', req);
    res.json({ message: 'Notification sent to all restaurants.' });
  } catch (err) { next(err); }
};

module.exports.notifyAllDelivery = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    // join DeliveryPersonnel → User to get push_token & user_id
    const dps = await db.DeliveryPersonnel.findAll({ include: db.User });
    const users = dps.map(dp => dp.User);
    await broadcast(users, title, body, 'broadcast-delivery', req);
    res.json({ message: 'Notification sent to all delivery personnel.' });
  } catch (err) { next(err); }
};