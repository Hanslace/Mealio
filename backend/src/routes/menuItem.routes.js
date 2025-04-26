// src/routes/menuItem.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const menuItemController = require('../controllers/menuItem.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Create a new menu item (restaurant_owner or admin)
router.post('/', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), menuItemController.createMenuItem);

// Fetch items by restaurant (public or logged in)
router.get('/restaurant/:restaurantId', menuItemController.getItemsByRestaurant);

// Update an item (restaurant_owner or admin)
router.put('/:itemId', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), menuItemController.updateMenuItem);

// Delete an item (restaurant_owner or admin)
router.delete('/:itemId', authMiddleware(), roleMiddleware(['admin','restaurant_owner']), menuItemController.deleteMenuItem);
router.get('/popular', authMiddleware(), menuItemController.getMostLikedItems);
router.get('/trending', authMiddleware(), menuItemController.getTrendingItems);

module.exports = router;
