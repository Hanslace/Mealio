// src/routes/index.js
const router = require('express').Router();

const adminRoutes = require('./admin.routes');
const authRoutes = require('./auth.routes');
const searchRoutes = require('./search.routes');
const restaurantRoutes = require('./restaurants.routes');
const menuItemRoutes = require('./menuItems.routes');
const couponRoutes = require('./coupons.routes');

router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/search', searchRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menu-items', menuItemRoutes);
router.use('/coupons', couponRoutes);

module.exports = router;
