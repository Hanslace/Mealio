const express = require('express');
const router = express.Router();
const { getTopRestaurants } = require('../controllers/restaurants.controller');

router.get('/', getTopRestaurants);

module.exports = router;
