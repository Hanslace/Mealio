const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const orderController = require('../controllers/order.controller');

// Create an order
router.post('/', authMiddleware(), orderController.createOrder);
// Get my orders
router.get('/', authMiddleware(), orderController.getMyOrders);

module.exports = router;
