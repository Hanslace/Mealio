const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const paymentController = require('../controllers/payment.controller');

// Gateway webhook — no auth
router.post('/webhook', paymentController.paymentWebhook);

// Authenticated routes
router.use(authMiddleware());


// Confirm COD (admin or restaurant owner)
router.put('/:paymentId/cod-confirm', roleMiddleware(['restaurant_owner']), paymentController.confirmCashPayment);

// Fail COD (admin or restaurant owner)
router.put('/:paymentId/cod-fail', roleMiddleware([ 'restaurant_owner']), paymentController.failCashPayment);

// Get all payments for an order
router.get('/order/:orderId', paymentController.getPaymentsForOrder);

module.exports = router;
