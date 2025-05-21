const express = require('express');
const router = express.Router();
const { getPopularMenuItems } = require('../controllers/menuItems.controller');
const authMiddleware  = require('../middlewares/auth.middleware');
const roleMiddleware  = require('../middlewares/role.middleware');


router.use(authMiddleware(), roleMiddleware(['customer']));

router.get('/popular', getPopularMenuItems);

module.exports = router;
