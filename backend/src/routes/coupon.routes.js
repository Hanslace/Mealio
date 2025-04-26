// src/routes/coupon.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const couponController = require('../controllers/coupon.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Create, update, delete restricted to admin/restaurant_owner
router.post('/', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), couponController.createCoupon);
router.put('/:couponId', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), couponController.updateCoupon);
router.delete('/:couponId', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), couponController.deleteCoupon);

// Public or logged-in can fetch coupons
router.get('/', couponController.getAllCoupons);
router.get('/:code', couponController.getCouponByCode);

module.exports = router;
