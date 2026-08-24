const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Ride = require('../models/Ride');

// POST /api/rides  (Post a Ride — final "Post Ride" button)
// Body: { from, to, via, date, time, seats, price }
router.post('/', protect, async (req, res) => {
  try {
    const { from, to, via, date, time, seats, price } = req.body;
    const ride = await Ride.create({
      driver: req.user._id,
      from, to, via, date, time,
      seatsTotal: seats,
      seatsAvailable: seats,
      price,
    });
    res.status(201).json({ ride });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/rides?from=&to=&date=  (Passenger Search screen)
router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const query = { status: 'active', seatsAvailable: { $gt: 0 } };
    if (from) query.from = new RegExp(from, 'i');
    if (to) query.to = new RegExp(to, 'i');
    if (date) query.date = date;

    const rides = await Ride.find(query).populate('driver', 'name rating verified car');
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rides/mine  (Driver Dashboard — my posted rides)
router.get('/mine', protect, async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id }).sort({ createdAt: -1 });
    res.json({ rides });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rides/:id  (Ride Details screen)
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('driver', 'name rating verified car reviewsCount');
    if (!ride) return res.status(404).json({ error: 'Ride not found.' });
    res.json({ ride });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;