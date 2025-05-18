const db = require('../models');
const DeliveryPersonnel = db.DeliveryPersonnel;
const User = db.User;

/**
 * Create delivery profile (for self or by admin)
 */
module.exports.createProfile = async (req, res, next) => {
  try {
    const { driver_license_no, vehicle_type } = req.body;

    // If admin, allow setting user_id manually
    const user_id = req.user.role === 'admin' ? req.body.user_id : req.user.user_id;

    // Check if already exists
    const existing = await DeliveryPersonnel.findOne({ where: { user_id } });
    if (existing) {
      return res.status(400).json({ error: 'Delivery profile already exists for this user' });
    }

    const profile = await DeliveryPersonnel.create({
      user_id,
      driver_license_no,
      vehicle_type,
      verification_status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    return res.status(201).json({ message: 'Delivery profile created', profile });
  } catch (err) {
    next(err);
  }
};

/**
 * Get my delivery profile
 */
module.exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await DeliveryPersonnel.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Delivery profile not found' });
    }

    return res.json(profile);
  } catch (err) {
    next(err);
  }
};

