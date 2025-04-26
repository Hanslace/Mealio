// src/routes/delivery.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const deliveryController = require('../controllers/delivery.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Assign a delivery person to an order (restaurant_owner or admin)
router.post('/assign', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), deliveryController.assignDelivery);

// Delivery person updates assignment status
router.put('/:assignmentId/status', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), deliveryController.updateAssignmentStatus);

// Delivery person logs location
router.post('/:assignmentId/location', authMiddleware(), roleMiddleware(['admin','delivery_personnel']), deliveryController.logLocation);

// Get location logs
router.get('/:assignmentId/location', authMiddleware(), roleMiddleware(['admin','delivery_personnel']), deliveryController.getLocationLogs);

module.exports = router;
