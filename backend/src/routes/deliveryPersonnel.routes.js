const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const controller = require('../controllers/deliveryPersonnel.controller');

router.use(authMiddleware());

router.post(
  '/',
  controller.createProfile
);

router.get(
  '/me',
  controller.getMyProfile
);

router.get(
  '/',
  roleMiddleware(['admin']),
  controller.listAll
);

router.put(
  '/:delivery_id/verify',
  roleMiddleware(['admin']),
  controller.verifyProfile
);

module.exports = router;
