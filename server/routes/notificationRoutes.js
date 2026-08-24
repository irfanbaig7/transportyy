const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');

// GET /api/notifications
router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ notifications });
});

// PATCH /api/notifications/read-all
router.patch('/read-all', protect, async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { unread: false });
  res.json({ message: 'All marked as read.' });
});

module.exports = router;