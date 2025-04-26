// src/routes/review.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const reviewController = require('../controllers/review.controller');
const roleMiddleware = require('../middlewares/role.middleware');

// Create a review
router.post('/', authMiddleware(), roleMiddleware(['admin','customer']), reviewController.createReview);

// Get all reviews for a restaurant
router.get('/restaurant/:restaurantId', reviewController.getReviewsForRestaurant);

// Update/Delete own review
router.put('/:reviewId', authMiddleware(), roleMiddleware(['admin','customer']), reviewController.updateReview);
router.delete('/:reviewId', authMiddleware(), roleMiddleware(['admin','customer']), reviewController.deleteReview);

module.exports = router;
