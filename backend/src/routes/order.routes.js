const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const orderController = require('../controllers/order.controller');
const roleMiddleware = require('../middlewares/role.middleware');


router.use(authMiddleware(), roleMiddleware(['customer']));
// Create an order
router.post('/', orderController.createOrder);
// Get my orders
router.get('/',  orderController.getMyOrders);

module.exports = router;
