const { Coupon } = require('../models');
const { Op } = require('sequelize');

exports.getValidCoupons = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    const today = new Date().toISOString().split('T')[0];

    const coupons = await Coupon.findAll({
      where: {
        valid_from: { [Op.lte]: today },
        valid_until: { [Op.gte]: today }
      },
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json(coupons);
  } catch (err) {
    next(err);
  }
};
