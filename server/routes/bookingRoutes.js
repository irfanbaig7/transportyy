const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const Notification = require('../models/Notification');

// POST /api/bookings  (Booking & Payment screen -> Confirm Booking)
// Body: { rideId, seats, paymentMethod }
// Payment abhi FAKE hai (turant "paid" ho jata hai) — real gateway ke liye neeche comment dekho.
router.post('/', protect, async (req, res) => {
  try {
    const { rideId, seats = 1, paymentMethod = 'UPI' } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found.' });
    if (ride.seatsAvailable < seats) return res.status(400).json({ error: 'Not enough seats available.' });

    const platformFee = 20;
    const total = ride.price * seats + platformFee;

    // 🔑 INJECT HERE (optional): real payment yaha verify karo (Razorpay order/signature check)
    // using RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET from server/.env, phir paymentStatus set karo.
    const paymentStatus = 'paid'; // fake success for now

    const booking = await Booking.create({
      ride: ride._id,
      passenger: req.user._id,
      driver: ride.driver,
      seats,
      pricePerSeat: ride.price,
      platformFee,
      total,
      paymentMethod,
      paymentStatus,
      status: 'upcoming',
      otp: String(Math.floor(1000 + Math.random() * 9000)),
    });

    ride.seatsAvailable -= seats;
    await ride.save();

    await Notification.create({
      user: ride.driver,
      type: 'booking',
      title: 'New booking request',
      body: `${req.user.name} booked ${seats} seat(s), ${ride.from} → ${ride.to}.`,
    });

    // Populate driver (with car) and ride before sending back,
    // so the frontend has everything it needs (name, car, route) right away.
    const populated = await Booking.findById(booking._id)
      .populate('driver', 'name rating car')
      .populate('ride');

    res.status(201).json({ booking: populated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings/mine?status=upcoming  (My Trips screen tabs)
router.get('/mine', protect, async (req, res) => {
  try {
    const query = { passenger: req.user._id };
    if (req.query.status) query.status = req.query.status;
    const bookings = await Booking.find(query)
      .populate('driver', 'name rating car')
      .populate('ride')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/requests  (Driver — Booking Requests screen, pending only)
router.get('/requests', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id, status: 'pending' })
      .populate('passenger', 'name rating tripsCount')
      .populate('ride');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/earnings  (Driver — completed bookings where I was the driver)
// Must stay ABOVE the "/:id" route below, otherwise "earnings" would be treated as an :id.
router.get('/earnings', protect, async (req, res) => {   // 👈 YE BLOCK YAHA UPAR LAO
  const bookings = await Booking.find({ driver: req.user._id, status: 'completed' })
    .populate('passenger', 'name')
    .populate('ride')
    .sort({ createdAt: -1 });
  res.json({ bookings });
});


// GET /api/bookings/:id  (Trip Details screen)
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('driver', 'name rating car').populate('ride');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/accept  (Driver accepts request)
router.patch('/:id/accept', protect, async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, driver: req.user._id },
    { status: 'upcoming' },
    { new: true }
  );
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  res.json({ booking });
});

// PATCH /api/bookings/:id/reject  (Driver rejects request)
router.patch('/:id/reject', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, driver: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.status === 'cancelled') return res.json({ booking });

    booking.status = 'cancelled';
    booking.cancelReason = 'Rejected by driver';
    await booking.save();

    await Ride.findByIdAndUpdate(booking.ride, { $inc: { seatsAvailable: booking.seats } });

    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/cancel  (Cancel Booking screen)  Body: { reason }
// Also gives the seat(s) back to the ride so other passengers can book them.
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, passenger: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.status === 'cancelled') return res.json({ booking });

    booking.status = 'cancelled';
    booking.cancelReason = req.body.reason || '';
    await booking.save();

    await Ride.findByIdAndUpdate(booking.ride, { $inc: { seatsAvailable: booking.seats } });

    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/start  (Trip Ongoing screen)
router.patch('/:id/start', protect, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'ongoing', progress: 0.1 }, { new: true });
  res.json({ booking });
});

// PATCH /api/bookings/:id/complete  (Trip Completed screen)
router.patch('/:id/complete', protect, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: 'completed', progress: 1 },
    { new: true }
  );
  await require('../models/User').findByIdAndUpdate(booking.passenger, { $inc: { tripsCount: 1 } });
  res.json({ booking });
});

// PATCH /api/bookings/:id/rate  (Rate & Review screen)  Body: { rating, text }
router.patch('/:id/rate', protect, async (req, res) => {
  const { rating, text } = req.body;
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { rated: true, myRating: rating, myReview: text },
    { new: true }
  );

  const User = require('../models/User');
  const driver = await User.findById(booking.driver);
  const newCount = driver.ratingCount + 1;
  driver.rating = ((driver.rating * driver.ratingCount) + rating) / newCount;
  driver.ratingCount = newCount;
  await driver.save();

  res.json({ booking });
});


// GET /api/bookings/:id  (Trip Details screen)

module.exports = router;