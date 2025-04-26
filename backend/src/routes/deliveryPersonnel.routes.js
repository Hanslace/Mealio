const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const controller = require('../controllers/deliveryPersonnel.controller');

// Logged-in users (role = delivery_personnel or admin) can create a profile
router.post(
  '/',
  authMiddleware(),
  controller.createProfile
);

// Delivery personnel gets their profile
router.get(
  '/me',
  authMiddleware(),
  controller.getMyProfile
);

// Admin gets all delivery personnel
router.get(
  '/',
  authMiddleware(),
  roleMiddleware(['admin']),
  controller.listAll
);

// Admin updates verification status
router.put(
  '/:delivery_id/verify',
  authMiddleware(),
  roleMiddleware(['admin']),
  controller.verifyProfile
);

module.exports = router;
