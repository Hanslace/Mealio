// src/controllers/user.controller.js
const db = require('../models');
const User = db.User;
const Address = db.Address;

module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] },
      include: [ Address ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching profile' });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.full_name = req.body.full_name || user.full_name;
    user.phone = req.body.phone || user.phone;
    user.is_verified = req.body.is_verified ?? user.is_verified;
    await user.save();

    return res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating profile' });
  }
};
