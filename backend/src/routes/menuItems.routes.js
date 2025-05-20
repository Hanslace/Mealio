const express = require('express');
const router = express.Router();
const { getPopularMenuItems } = require('../controllers/menuItems.controller');

router.get('/popular', getPopularMenuItems);

module.exports = router;
