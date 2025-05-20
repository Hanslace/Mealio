// src/routes/index.js
const router = require('express').Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const addressRoutes = require('./address.routes');
const restaurantRoutes = require('./restaurant.routes');
const menuItemRoutes = require('./menuItem.routes');
const couponRoutes = require('./coupon.routes');
const reviewRoutes = require('./review.routes');
const orderRoutes = require('./order.routes');
const deliveryRoutes = require('./delivery.routes');
const chatRoutes = require('./chat.routes');
const paymentRoutes = require('./payment.routes');
const adminRoutes = require('./admin.routes');
const deliveryPersonnelRoutes = require('./deliveryPersonnel.routes');
const menuItemLikeRoutes = require('./menuItemLike.routes');
const notificationRoutes = require('./notification.routes');

// router.use('/notifications', notificationRoutes);
// router.use('/likes', menuItemLikeRoutes);
// router.use('/delivery-personnel', deliveryPersonnelRoutes);
// router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/addresses', addressRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/menu-items', menuItemRoutes);
router.use('/coupons', couponRoutes);
// router.use('/reviews', reviewRoutes);
// router.use('/orders', orderRoutes);
// router.use('/delivery', deliveryRoutes);
// router.use('/chat', chatRoutes);

module.exports = router;
