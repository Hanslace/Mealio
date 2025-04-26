const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

module.exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role, push_token } = req.body; // Accept push_token too

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role: role || 'customer',
      push_token: push_token || null,  // Save the push token
    });

    return res.status(201).json({
      message: 'User registered',
      user_id: newUser.user_id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password, push_token } = req.body; // Accept push_token during login too

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Update push_token in DB on login
    if (push_token) {
      user.push_token = push_token;
      await user.save();
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const { push_token } = req.body;

    if (!push_token) {
      return res.status(400).json({ error: 'Push token is required to logout device properly' });
    }

    // Delete only the push token for this device
    await PushToken.destroy({
      where: {
        user_id: req.user.user_id,
        push_token: push_token
      }
    });

    return res.json({ message: 'Logged out and push token removed for this device' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Logout failed' });
  }
};