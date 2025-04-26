const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantController = require('../controllers/restaurant.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// ✅ Create new restaurant (only owner or admin)
router.post('/', 
  authMiddleware(), 
  roleMiddleware(['admin', 'restaurant_owner']), 
  restaurantController.createRestaurant
);

// ✅ Get my own restaurants
router.get('/mine', 
  authMiddleware(), 
  roleMiddleware(['admin', 'restaurant_owner']), 
  restaurantController.getMyRestaurants
);

// ✅ Get all open restaurants (public)
router.get('/', 
  restaurantController.getAllRestaurants
);


// ✅ Update restaurant
router.put('/:id', 
  authMiddleware(), 
  roleMiddleware(['admin', 'restaurant_owner']), 
  restaurantController.updateRestaurant
);

// ✅ Search restaurants by name (public)
router.get('/search/name', 
  restaurantController.searchRestaurantsByName
);

module.exports = router;