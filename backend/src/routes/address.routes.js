// src/routes/address.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const addressController = require('../controllers/address.controller');

router.use(authMiddleware());

// All routes require user to be logged in
router.post('/',  addressController.createAddress);
router.get('/',  addressController.getMyAddresses);
router.put('/:addressId', addressController.updateAddress);
router.delete('/:addressId',  addressController.deleteAddress);

module.exports = router;
