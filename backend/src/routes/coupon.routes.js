// src/routes/coupon.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const couponController = require('../controllers/coupon.controller');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware());
// Create, update, delete restricted to admin/restaurant_owner
router.post('/',  roleMiddleware(['restaurant_owner']), couponController.createCoupon);
router.put('/:couponId',roleMiddleware(['restaurant_owner']), couponController.updateCoupon);
router.delete('/:couponId',  roleMiddleware(['restaurant_owner']), couponController.deleteCoupon);

// Public or logged-in can fetch coupons
router.get('/', couponController.getAllCoupons);
router.get('/:code', couponController.getCouponByCode);

module.exports = router;
