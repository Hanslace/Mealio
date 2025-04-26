const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantController = require('../controllers/restaurant.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Only owners/admin
router.post('/', authMiddleware(), roleMiddleware(['admin', 'restaurant_owner']), restaurantController.createRestaurant);
router.get('/mine', authMiddleware(), roleMiddleware(['admin', 'restaurant_owner']), restaurantController.getMyRestaurants);
// ... more endpoints as needed

module.exports = router;
