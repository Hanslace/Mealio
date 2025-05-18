const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const restaurantController = require('../controllers/restaurant.controller');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware());

// ✅ Create new restaurant (only owner or admin)
router.post('/', 
   
  roleMiddleware(['restaurant_owner']), 
  restaurantController.createRestaurant
);

// ✅ Get my own restaurants
router.get('/mine', 
  roleMiddleware(['restaurant_owner']), 
  restaurantController.getMyRestaurants
);

// ✅ Get all open restaurants (public)
router.get('/', 
  restaurantController.getAllRestaurants
);


// ✅ Update restaurant
router.put('/:id', 
  roleMiddleware(['restaurant_owner']), 
  restaurantController.updateRestaurant
);

// ✅ Search restaurants by name (public)
router.get('/search', 
  restaurantController.searchRestaurantsByName
);

module.exports = router;