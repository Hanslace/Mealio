const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const controller = require('../controllers/menuItemLike.controller');

router.use(authMiddleware()); // all require login

// Like a menu item
router.post('/', controller.likeItem);

// Unlike a menu item
router.delete('/:item_id', controller.unlikeItem);

// Get my liked items
router.get('/', controller.getMyLikedItems);

// Get total likes for an item
router.get('/count/:item_id', controller.getItemLikeCount);

module.exports = router;
