// src/routes/menuItem.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const menuItemController = require('../controllers/menuItem.controller');
const roleMiddleware = require('../middlewares/role.middleware');

router.use(authMiddleware());

// Create a new menu item (restaurant_owner or admin)
router.post('/',  roleMiddleware(['restaurant_owner']), menuItemController.createMenuItem);

// Fetch items by restaurant (public or logged in)
router.get('/restaurant/:restaurantId', menuItemController.getItemsByRestaurant);

// Update an item (restaurant_owner or admin)
router.put('/:itemId', roleMiddleware(['restaurant_owner']), menuItemController.updateMenuItem);

// Delete an item (restaurant_owner or admin)
router.delete('/:itemId', roleMiddleware(['restaurant_owner']), menuItemController.deleteMenuItem);
router.get('/popular', menuItemController.getMostLikedItems);
router.get('/trending', menuItemController.getTrendingItems);

module.exports = router;
