// src/controllers/restaurant.controller.js
const db = require('../models');
const Restaurant = db.Restaurant;
const MenuItem = db.MenuItem;

module.exports.createRestaurant = async (req, res) => {
  try {
    const { restaurant_name, license_number, address } = req.body;
    const newRestaurant = await Restaurant.create({
      owner_id: req.user.user_id,
      restaurant_name,
      license_number,
      address
    });

    return res.status(201).json(newRestaurant);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating restaurant' });
  }
};

module.exports.getMyRestaurants = async (req, res) => {
  try {

    const restaurants = await Restaurant.findAll({
      where: { owner_id: req.user.user_id },
      include: [ MenuItem ]
    });

    return res.json(restaurants);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching restaurants' });
  }
};
