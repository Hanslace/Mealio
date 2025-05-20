const express = require('express');
const router = express.Router();
const { getValidCoupons } = require('../controllers/coupons.controller');

router.get('/active', getValidCoupons);

module.exports = router;
