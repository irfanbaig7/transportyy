const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  // 🔑 Uses JWT_SECRET + JWT_EXPIRES_IN from server/.env — see .env.example
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });

// POST /api/auth/signup  { name, phone, email?, password, city? }
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, email, password, city } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'name, phone and password are required.' });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters.' });
    }
    // 10-digit Indian mobile number (frontend already strips spaces/country code)
    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const exists = await User.findOne({ phone });
    if (exists) return res.status(409).json({ error: 'Phone number already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, email, password: hashed, city });

    res.status(201).json({ user: user.toSafeObject(), token: signToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login  { phone, password }
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ error: 'Invalid phone or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid phone or password.' });

    res.json({ user: user.toSafeObject(), token: signToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/forgot-password  { phone }
// Abhi ke liye OTP sirf console me print hota hai + response me bhejta hai (DEV ONLY),
// taaki real SMS provider ke bina bhi test kar sako.
router.post('/forgot-password', async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ error: 'No account with this phone number.' });

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // 🔑 INJECT HERE: real SMS bhejne ke liye Twilio/MSG91 call yaha karo,
    // aur neeche wali dev line hata do taaki OTP response me expose na ho.
    console.log(`📩 OTP for ${phone}: ${otp}`);

    res.json({ message: 'OTP sent.', devOtp: otp }); // devOtp: production me remove karo
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-otp  { phone, otp }
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone });
    if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }
    res.json({ message: 'OTP verified.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/reset-password  { phone, otp, newPassword }
router.post('/reset-password', async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    const user = await User.findOne({ phone });
    if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;