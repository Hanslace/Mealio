// src/controllers/restaurant.controller.js
const db = require('../models');
const Restaurant = db.Restaurant;
const MenuItem = db.MenuItem;
const { Op } = db.Sequelize

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

module.exports.updateRestaurant = async (req, res) => {
  try {
    const { restaurant_name, address, contact_phone, opening_time, closing_time, status } = req.body;

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: req.params.id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    await restaurant.update({
      restaurant_name,
      address,
      contact_phone,
      opening_time,
      closing_time,
      status
    });

    return res.json(restaurant);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating restaurant' });
  }
};

module.exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { status: 'open', is_deleted: false },
      include: [MenuItem]
    });

    return res.json(restaurants);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching all restaurants' });
  }
};

module.exports.searchRestaurantsByName = async (req, res) => {
  try {
    const { name } = req.query;  // Get ?name=pizza from query string

    if (!name) {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }

    const restaurants = await Restaurant.findAll({
      where: {
        restaurant_name: {
          [Op.iLike]: `%${name}%` // Case-insensitive partial match (Postgres)
        },
        status: 'open',
        is_deleted: false
      },
      include: [MenuItem]
    });

    return res.json(restaurants);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error searching restaurants' });
  }
};