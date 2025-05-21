const { Op }       = require('sequelize');
const { MenuItem, Restaurant, Address } = require('../models');

exports.searchItems = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ error: 'q query param required' });

    const offset = (page - 1) * limit;
    const { count, rows } = await MenuItem.findAndCountAll({
      where: {
        is_available: true,
        [Op.or]: [
          { item_name:  { [Op.iLike]: `%${q}%` } },
          { description:{ [Op.iLike]: `%${q}%` } },
          { category :{ [Op.iLike]: `%${q}%` } }
        ]
      },
      order: [['item_name', 'ASC']],
      limit:  parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({ count, rows });
  } catch (err) {
    next(err);
  }
};

exports.searchRestaurants = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ error: 'q query param required' });

    const offset = (page - 1) * limit;
    const { count, rows } = await Restaurant.findAndCountAll({
      where: {
        status: 'open',
        is_deleted: false,
        [Op.or]: [
          { restaurant_name: { [Op.iLike]: `%${q}%` } },
          { cuisine_type:    { [Op.iLike]: `%${q}%` } },
          { description:     { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [{
        model: Address,
        as: 'address'
      }],
      order: [['restaurant_name','ASC']],
      limit:  parseInt(limit, 10),
      offset: parseInt(offset, 10)
    });

    res.json({ count, rows });
  } catch (err) {
    next(err);
  }
};
