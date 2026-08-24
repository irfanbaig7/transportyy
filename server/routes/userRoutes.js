const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/users/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
});

// PATCH /api/users/me  (Edit Profile screen)
router.patch('/me', protect, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'email', 'city'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/users/driver-profile  (Driver sign-up: basic info + car details combined)
router.patch('/driver-profile', protect, async (req, res) => {
  try {
    const { car, city } = req.body;
    const user = await User.findById(req.user._id);
    if (car) user.car = { ...(user.car?.toObject?.() || {}), ...car };
    if (city) user.city = city;
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/users/documents  (Driver Documents screen)
// Body: { licenseUrl, rcUrl, insuranceUrl, photoUrl }
// 🔑 INJECT HERE (optional): agar real file upload chahiye (S3/Cloudinary),
// wo upload multer/cloudinary se karke yaha sirf resulting URL bhejo.
router.patch('/documents', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.documents = { ...(user.documents?.toObject?.() || {}), ...req.body };
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/become-driver  (Driver Review & Go Live screen)
router.post('/become-driver', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: 'driver', isAvailable: true, driverProfileComplete: true },
      { new: true }
    );
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/users/availability  { isAvailable: true/false }  (Dashboard toggle)
router.patch('/availability', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isAvailable: !!req.body.isAvailable },
      { new: true }
    );
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;