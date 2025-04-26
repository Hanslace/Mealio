// src/controllers/review.controller.js
const db = require('../models');
const Review = db.Review;
const Restaurant = db.Restaurant;

module.exports.createReview = async (req, res) => {
  try {
    const { restaurant_id, rating, comment } = req.body;
    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    const newReview = await Review.create({
      user_id: req.user.user_id,
      restaurant_id,
      rating,
      comment
    });
    return res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating review' });
  }
};

module.exports.getReviewsForRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.findAll({ where: { restaurant_id: restaurantId } });
    return res.json(reviews);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching reviews' });
  }
};

module.exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    // only the user who created it or admin can edit
    if (review.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();
    return res.json({ message: 'Review updated successfully', review });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating review' });
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    if (review.user_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await review.destroy();
    return res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error deleting review' });
  }
};
