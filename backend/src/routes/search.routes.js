const express = require('express');
const router  = express.Router();
const {
  searchItems,
  searchRestaurants
} = require('../controllers/search.controller');


const authMiddleware  = require('../middlewares/auth.middleware');
const roleMiddleware  = require('../middlewares/role.middleware');

router.use(authMiddleware(), roleMiddleware(['customer']));


router.get('/items',       searchItems);
router.get('/restaurants', searchRestaurants);

module.exports = router;
