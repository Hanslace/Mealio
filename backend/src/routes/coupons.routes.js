const express = require('express');
const router = express.Router();
const { getValidCoupons } = require('../controllers/coupons.controller');
const authMiddleware  = require('../middlewares/auth.middleware');
const roleMiddleware  = require('../middlewares/role.middleware');

router.use(authMiddleware(), roleMiddleware(['customer']));

router.get('/active', getValidCoupons);

module.exports = router;
