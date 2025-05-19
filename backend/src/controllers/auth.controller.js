// controllers/auth.controller.js
const bcrypt       = require('bcrypt');
const jwt          = require('jsonwebtoken');
const crypto       = require('crypto');
const { Op }       = require('sequelize');
const db           = require('../models');
const User         = db.User;
const sendEmail    = require('../utils/sendEmail');

// ─── Register (with email‐verification) ─────────────────────────────────────
module.exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role, push_token } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      full_name,
      email,
      password_hash: hashedPassword,
      role,
      push_token: push_token || null,
      // is_verified defaults to false via migration
    });

    // generate a 24h‐valid verification token
    const token = crypto.randomBytes(32).toString('hex');
    newUser.verification_token         = token;
    newUser.verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await newUser.save();

    // send verification email
    const link = `${process.env.WEB_URL}/verify-email?token=${token}`;
    // if your helper is defined as sendEmail(to, subject, html)
    await sendEmail(
      email,
      'Please verify your Mealio account',
      `<p>Click <a href="${link}">here</a> to verify your email address.</p>`
    );


    return res.status(201).json({
      message: 'User registered. Verification email sent.',
      user_id: newUser.user_id,
      email:   newUser.email
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// ─── Verify Email ───────────────────────────────────────────────────────────
module.exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({
      where: {
        verification_token:       token,
        verification_token_expires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.is_verified               = true;
    user.verification_token        = null;
    user.verification_token_expires = null;
    await user.save();

    return res.json({ success: true, message: 'Email verified' });
  } catch (err) {
    console.error('verifyEmail error:', err);
    return res.status(500).json({ error: 'Could not verify email' });
  }
};

// ─── Resend Verification ────────────────────────────────────────────────────
module.exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'No user with that email' });
    }

    // regen token & expiry
    const token = crypto.randomBytes(32).toString('hex');
    user.verification_token         = token;
    user.verification_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const link = `${process.env.WEB_URL}/verify-email?token=${token}`;
    await sendEmail(
      email,
      'Your new Mealio verification link',
      `<p>Click <a href="${link}">here</a> to verify your email address.</p>`
    );

    return res.json({ message: 'Verification email resent' });
  } catch (err) {
    console.error('resendVerification error:', err);
    return res.status(500).json({ error: 'Could not resend verification' });
  }
};


// ─── Login ────────────────────────────────────────────────────────────────────
module.exports.login = async (req, res) => {
  try {
    const { email, password, push_token } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

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
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
module.exports.logout = async (req, res) => {
  try {
    const { push_token } = req.body;
    if (!push_token) {
      return res.status(400).json({ error: 'Push token is required' });
    }
    // Assuming you have a PushToken model; adjust if yours differs
    await db.PushToken.destroy({
      where: {
        user_id:   req.user.user_id,
        push_token
      }
    });
    return res.json({ message: 'Logged out and push token removed' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ where: { email } });
    // Always respond 200 to avoid user enumeration
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link was sent.' });
    }

    // throttle: one email per minute
    const now = new Date();
    if (user.password_reset_sent_at && now - user.password_reset_sent_at < 60*1000) {
      return res
        .status(429)
        .json({ message: 'Please wait before requesting another reset.' });
    }

    const token   = crypto.randomBytes(32).toString('hex');
    const expires = new Date(now.getTime() + 60*60*1000); // 1 hour

    user.password_reset_token   = token;
    user.password_reset_expires = expires;
    user.password_reset_sent_at = now;
    await user.save();

    const resetUrl = `${process.env.WEB_URL}reset-password/${token}`;
    const html     = `
      <p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset.
      Link expires in 1 hour.</p>
    `;
    await sendEmail(user.email, 'Reset your Mealio password', html);

    return res.json({ message: 'If that email is registered, a reset link was sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Could not process request' });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
module.exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const user = await User.findOne({
      where: {
        password_reset_token:   token,
        password_reset_expires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or expired.' });
    }

    user.password_hash            = await bcrypt.hash(newPassword, 10);
    user.password_reset_token     = null;
    user.password_reset_expires   = null;
    user.password_reset_sent_at   = null;
    await user.save();

    return res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Could not reset password' });
  }
};


module.exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: 'Reset token is required.' });
    }

    const user = await User.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    // Token is valid
    return res.json({ message: 'Token is valid.' });
  } catch (err) {
    console.error('verifyResetToken error:', err);
    return res.status(500).json({ error: 'Could not verify reset token.' });
  }
};