const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

// POST /api/admin/bootstrap  { phone, setupKey }
// Ek baar chalao taaki koi ek user ko admin bana sako (fir isse hata dena ya setup key change kar dena).
router.post('/bootstrap', async (req, res) => {
    const { phone, setupKey } = req.body;
    if (!setupKey || setupKey !== process.env.ADMIN_SETUP_KEY) {
        return res.status(403).json({ error: 'Invalid setup key.' });
    }
    const user = await User.findOneAndUpdate({ phone }, { isAdmin: true }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: `${user.name} is now an admin.` });
});

// Sab neeche wale routes admin-only hain
router.use(protect, requireAdmin);

// GET /api/admin/drivers/pending  — jo drivers ne documents upload kiye hain but verified nahi hain
router.get('/drivers/pending', async (req, res) => {
    const drivers = await User.find({
        role: 'driver',
        verified: false,
        'documents.licenseUrl': { $exists: true, $ne: '' },
    }).select('-password');
    res.json({ drivers });
});

// PATCH /api/admin/drivers/:id/verify  { approve: true/false }
router.patch('/drivers/:id/verify', async (req, res) => {
    const { approve } = req.body;
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { verified: !!approve },
        { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: user.toSafeObject() });
});

// PATCH /api/admin/users/:id/ban  { banned: true/false }
router.patch('/users/:id/ban', async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isBanned: !!req.body.banned },
        { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ user: user.toSafeObject() });
});

// GET /api/admin/stats  — basic dashboard numbers
router.get('/stats', async (req, res) => {
    const [totalUsers, totalDrivers, totalRides, totalBookings, pendingVerifications] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'driver' }),
        Ride.countDocuments(),
        Booking.countDocuments(),
        User.countDocuments({ role: 'driver', verified: false, 'documents.licenseUrl': { $exists: true, $ne: '' } }),
    ]);
    res.json({ totalUsers, totalDrivers, totalRides, totalBookings, pendingVerifications });
});

module.exports = router;