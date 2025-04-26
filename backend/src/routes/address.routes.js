// src/routes/address.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const addressController = require('../controllers/address.controller');

// All routes require user to be logged in
router.post('/', authMiddleware(), addressController.createAddress);
router.get('/', authMiddleware(), addressController.getMyAddresses);
router.put('/:addressId', authMiddleware(), addressController.updateAddress);
router.delete('/:addressId', authMiddleware(), addressController.deleteAddress);

module.exports = router;
