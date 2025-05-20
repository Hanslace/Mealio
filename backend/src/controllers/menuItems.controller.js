const { MenuItem, Restaurant, Address } = require('../models');
const { literal } = require('sequelize');

exports.getPopularMenuItems = async (req, res, next) => {
  try {
    const { lat, lng, limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query params required' });
    }

    const distance = literal(`
      6371 * acos(
        cos(radians(${lat})) * cos(radians("address"."latitude")) *
        cos(radians("address"."longitude") - radians(${lng})) +
        sin(radians(${lat})) * sin(radians("address"."latitude"))
      )
    `);

    const items = await MenuItem.findAll({
      include: [{
        model: Restaurant,
        include: [{ model: Address, as: 'address', attributes: ['latitude','longitude'] }]
      }],
      where: { is_available: true },
      attributes: { include: [[distance, 'distance_km']] },
      order: literal('"distance_km" ASC'),
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json(items);
  } catch (err) {
    next(err);
  }
};
