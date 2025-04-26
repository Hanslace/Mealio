// src/controllers/coupon.controller.js
const db = require('../models');
const Coupon = db.Coupon;

module.exports.createCoupon = async (req, res) => {
  try {
    const { code, discount_type, discount_value, valid_from, valid_until, usage_limit } = req.body;

    const coupon = await Coupon.create({
      code,
      discount_type,
      discount_value,
      valid_from,
      valid_until,
      usage_limit: usage_limit || 0
    });
    return res.status(201).json(coupon);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating coupon' });
  }
};

module.exports.getAllCoupons = async (req, res) => {
  try {
    // Anyone can see available coupons
    const coupons = await Coupon.findAll();
    return res.json(coupons);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching coupons' });
  }
};

module.exports.getCouponByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const coupon = await Coupon.findOne({ where: { code } });
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    return res.json(coupon);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching coupon' });
  }
};

module.exports.updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    coupon.discount_type = req.body.discount_type ?? coupon.discount_type;
    coupon.discount_value = req.body.discount_value ?? coupon.discount_value;
    coupon.valid_from = req.body.valid_from ?? coupon.valid_from;
    coupon.valid_until = req.body.valid_until ?? coupon.valid_until;
    coupon.usage_limit = req.body.usage_limit ?? coupon.usage_limit;

    await coupon.save();
    return res.json({ message: 'Coupon updated successfully', coupon });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating coupon' });
  }
};

module.exports.deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findByPk(couponId);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    await coupon.destroy();
    return res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error deleting coupon' });
  }
};
