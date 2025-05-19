const router = require('express').Router();
const authMiddleware  = require('../middlewares/auth.middleware');
const roleMiddleware  = require('../middlewares/role.middleware');
const adminController = require('../controllers/admin.controller');

// All admin routes require user to be admin
router.use(authMiddleware(), roleMiddleware(['admin']));

router.get('/me', adminController.me);


// Dashboard metrics
router.get('/dashboard', adminController.getDashboardMetrics);

// Users
router.get('/users', adminController.listUsers);
router.put('/users/:userId/ban', adminController.banUser);
router.put('/users/:userId/reactivate', adminController.reactivateUser);

// Restaurants
router.get('/restaurants', adminController.listRestaurants);
router.put('/restaurants/:restaurantId/approve',  adminController.approveRestaurant);
router.put('/restaurants/:restaurantId/reject',   adminController.rejectRestaurant);
router.put('/restaurants/:restaurantId/suspend',  adminController.suspendRestaurant);
router.put('/restaurants/:restaurantId/unsuspend',adminController.unsuspendRestaurant);

// Delivery Personnel
// Delivery Personnel
router.get('/delivery-personnel',                 adminController.listDeliveryPersonnel);
router.put('/delivery-personnel/:id/verify',      adminController.verifyProfile);
router.put('/delivery-personnel/:id/reject',      adminController.rejectProfile);
router.put('/delivery-personnel/:id/suspend',     adminController.suspendDelivery);
router.put('/delivery-personnel/:id/unsuspend',   adminController.unsuspendDelivery);


// Broadcast notifications
router.post('/notify/all-users',               adminController.notifyAllUsers);
router.post('/notify/all-restaurants',         adminController.notifyAllRestaurants);
router.post('/notify/all-delivery-personnel',  adminController.notifyAllDelivery);

module.exports = router;
