const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const deliveryController = require('../controllers/delivery.controller');

// 🛡️ All routes require authentication
router.use(authMiddleware());

// 📦 Assign a delivery person to an order (only admin or restaurant owner)
router.post('/assign', roleMiddleware(['admin', 'restaurant_owner']), deliveryController.assignDelivery);

// 🚚 Delivery personnel or admin update assignment status (picked_up, delivering, delivered)
router.put('/:assignmentId/status', roleMiddleware(['admin', 'delivery_personnel']), deliveryController.updateAssignmentStatus);

// 📍 Delivery personnel log location (every few seconds) - can also be used as API backup
router.post('/:assignmentId/location', roleMiddleware(['admin', 'delivery_personnel']), deliveryController.logLocation);

// 🗺️ Fetch full location history (admin / assigned delivery person)
router.get('/:assignmentId/location', roleMiddleware(['admin']), deliveryController.getLocationLogs);

module.exports = router;