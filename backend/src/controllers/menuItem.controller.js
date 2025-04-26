// src/controllers/menuItem.controller.js
const db = require('../models');
const MenuItem = db.MenuItem;
const Restaurant = db.Restaurant;
const MenuItemLike = db.MenuItemLike;
const { sequelize } = require('../models');

module.exports.createMenuItem = async (req, res) => {
  try {
    const { restaurant_id, item_name, description, price, category, is_available, image_url } = req.body;

    // check if the restaurant belongs to the user (if the user is restaurant_owner)
    if (req.user.role === 'restaurant_owner') {
      const restaurant = await Restaurant.findOne({
        where: { restaurant_id, owner_id: req.user.user_id }
      });
      if (!restaurant) {
        return res.status(403).json({ error: 'You do not own this restaurant' });
      }
    }

    const newItem = await MenuItem.create({
      restaurant_id,
      item_name,
      description,
      price,
      category,
      is_available,
      image_url
    });
    return res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating menu item' });
  }
};


module.exports.getItemsByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Get all menu items for this restaurant
    const items = await MenuItem.findAll({ where: { restaurant_id: restaurantId } });

    // If user is logged in, get their liked item IDs
    let likedItemIds = [];
    if (req.user) {
      const likes = await MenuItemLike.findAll({
        where: { user_id: req.user.user_id }
      });
      likedItemIds = likes.map(like => like.item_id);
    }

    // Map items and attach liked flag
    const enrichedItems = items.map(item => ({
      ...item.toJSON(),
      liked: likedItemIds.includes(item.item_id)
    }));

    return res.json(enrichedItems);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching menu items' });
  }
};

module.exports.updateMenuItem = async (req, res) => {
  try {

    const { itemId } = req.params;
    const menuItem = await MenuItem.findByPk(itemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // If user is a restaurant_owner, ensure they own the restaurant
    if (req.user.role === 'restaurant_owner') {
      const ownedRestaurant = await db.Restaurant.findOne({
        where: { restaurant_id: menuItem.restaurant_id, owner_id: req.user.user_id }
      });
      if (!ownedRestaurant) {
        return res.status(403).json({ error: 'You do not own this restaurant' });
      }
    }

    // update fields
    menuItem.item_name = req.body.item_name ?? menuItem.item_name;
    menuItem.description = req.body.description ?? menuItem.description;
    menuItem.price = req.body.price ?? menuItem.price;
    menuItem.category = req.body.category ?? menuItem.category;
    menuItem.is_available = req.body.is_available ?? menuItem.is_available;
    menuItem.image_url = req.body.image_url ?? menuItem.image_url;

    await menuItem.save();
    return res.json({ message: 'Menu item updated successfully', menuItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating menu item' });
  }
};

module.exports.deleteMenuItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const menuItem = await MenuItem.findByPk(itemId);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // ensure ownership if not admin
    if (req.user.role === 'restaurant_owner') {
      const ownedRestaurant = await db.Restaurant.findOne({
        where: { restaurant_id: menuItem.restaurant_id, owner_id: req.user.user_id }
      });
      if (!ownedRestaurant) {
        return res.status(403).json({ error: 'You do not own this restaurant' });
      }
    }

    await menuItem.destroy();
    return res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error deleting menu item' });
  }
};

module.exports.getMostLikedItems = async (req, res) => {
  try {
    const results = await db.MenuItem.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('MenuItemLikes.like_id')), 'like_count']
        ]
      },
      include: [
        {
          model: db.MenuItemLike,
          attributes: [],
        }
      ],
      group: ['MenuItem.item_id'],
      order: [[sequelize.literal('like_count'), 'DESC']],
      limit: 10
    });

    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching popular items' });
  }
};

module.exports.getTrendingItems = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    const trending = await db.MenuItem.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('MenuItemLikes.like_id')), 'like_count']
        ]
      },
      include: [{
        model: db.MenuItemLike,
        attributes: [],
        where: {
          created_at: {
            [sequelize.Op.gte]: sequelize.literal(`NOW() - INTERVAL '${days} days'`)
          }
        }
      }],
      group: ['MenuItem.item_id'],
      order: [[sequelize.literal('like_count'), 'DESC']],
      limit: 10
    });

    return res.json(trending);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching trending items' });
  }
};