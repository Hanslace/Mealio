// src/controllers/admin.controller.js
const db = require('../models');
const User = db.User;
const Order = db.Order;
const Restaurant = db.Restaurant;

/**
 * Dashboard metrics for the admin
 */
module.exports.getDashboardMetrics = async (req, res, next) => {
  try {
    // Example metrics
    const totalUsers = await User.count();
    const totalRestaurants = await Restaurant.count();
    const totalOrders = await Order.count();

    // Could do a sum of net_amount for total revenue
    // NOTE: This is simplistic; real systems handle partial payments, refunds, etc.
    const [result] = await db.sequelize.query(
      'SELECT SUM(net_amount) as total_revenue FROM orders'
    );
    const totalRevenue = result[0].total_revenue || 0;

    return res.json({
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Manage users
 * e.g. list all users, or filter by role, or "ban" a user
 */
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

module.exports.banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ban user = is_active = false
    user.is_active = false;
    await user.save();
    return res.json({ message: `User ${userId} banned.`, user });
  } catch (err) {
    next(err);
  }
};

module.exports.reactivateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.is_active = true;
    await user.save();
    return res.json({ message: `User ${userId} reactivated.`, user });
  } catch (err) {
    next(err);
  }
};
