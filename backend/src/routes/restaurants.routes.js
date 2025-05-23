const express = require('express');
const router = express.Router();
const { getTopRestaurants } = require('../controllers/restaurants.controller');
const authMiddleware  = require('../middlewares/auth.middleware');
const roleMiddleware  = require('../middlewares/role.middleware');

router.use(authMiddleware(), roleMiddleware(['customer']));

router.get('/', getTopRestaurants);

module.exports = router;
