const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const Notification = require('../models/Notification');

// POST /api/bookings
// Agar isi passenger ki isi ride pe pehle se active booking hai (pending/upcoming),
// to naya document banane ke bajaye usi mein seats add kar do — duplicate rows nahi banenge.
router.post('/', protect, async (req, res) => {
  try {
    const { rideId, seats = 1, paymentMethod = 'UPI' } = req.body;

    // 👇 PEHLE: sirf existence + ownership check ke liye halka fetch
    const rideCheck = await Ride.findById(rideId);
    if (!rideCheck) return res.status(404).json({ error: 'Ride not found.' });

    if (String(rideCheck.driver) === String(req.user._id)) {
      return res.status(400).json({ error: 'You cannot book your own ride.' });
    }

    // 👇 NAYA: atomic seat-deduction — race-condition-safe
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, seatsAvailable: { $gte: seats } },
      { $inc: { seatsAvailable: -seats } },
      { new: true }
    );
    if (!ride) return res.status(400).json({ error: 'Not enough seats available.' });

    const platformFee = 20;
    const paymentStatus = 'paid'; // fake success for now

    let booking = await Booking.findOne({
      ride: ride._id,
      passenger: req.user._id,
      status: { $in: ['pending', 'upcoming'] },
    });
    const wasExisting = !!booking;

    if (booking) {
      booking.seats += seats;
      booking.total = booking.pricePerSeat * booking.seats + booking.platformFee;
      booking.paymentMethod = paymentMethod;
      await booking.save();
    } else {
      booking = await Booking.create({
        ride: ride._id,
        passenger: req.user._id,
        driver: ride.driver,
        seats,
        pricePerSeat: ride.price,
        platformFee,
        total: ride.price * seats + platformFee,
        paymentMethod,
        paymentStatus,
        status: 'upcoming',
        otp: String(Math.floor(1000 + Math.random() * 9000)),
      });
    }

    // 👇 YE PURANI 2 LINES HATA DO (ab zaroorat nahi — upar hi atomic ho gaya):
    // ride.seatsAvailable -= seats;
    // await ride.save();

    await Notification.create({
      user: ride.driver,
      type: 'booking',
      title: wasExisting ? 'Booking updated' : 'New booking request',
      body: wasExisting
        ? `${req.user.name} added ${seats} more seat(s), ${ride.from} → ${ride.to}.`
        : `${req.user.name} booked ${seats} seat(s), ${ride.from} → ${ride.to}.`,
    });

    const populated = await Booking.findById(booking._id)
      .populate('driver', 'name rating car')
      .populate('ride');

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${ride.driver}`).emit('booking:new', populated);
      io.emit('ride:updated', { rideId: ride._id.toString(), seatsAvailable: ride.seatsAvailable });
    }

    res.status(201).json({ booking: populated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings/mine?status=upcoming  (Passenger — My Trips tabs)
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

// GET /api/bookings/driver-trips  (Driver — My Trips screen, ALL statuses)
// Must stay ABOVE "/:id" below.
router.get('/driver-trips', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id })
      .populate('passenger', 'name rating')
      .populate('ride')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings/requests  (Driver — pending only)
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

// GET /api/bookings/earnings  (Driver — completed bookings)
// Must stay ABOVE "/:id" below.
router.get('/earnings', protect, async (req, res) => {
  const bookings = await Booking.find({ driver: req.user._id, status: 'completed' })
    .populate('passenger', 'name')
    .populate('ride')
    .sort({ createdAt: -1 });
  res.json({ bookings });
});

// GET /api/bookings/ride/:rideId  (Driver — sab bookings ek specific ride ke)
// Must stay ABOVE "/:id" below.
router.get('/ride/:rideId', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ ride: req.params.rideId, driver: req.user._id })
      .populate('passenger', 'name rating')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/bookings/:id  (Trip Details — both driver & passenger)
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('driver', 'name rating car')
      .populate('passenger', 'name rating')
      .populate('ride');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });

    const uid = String(req.user._id);
    if (String(booking.driver._id) !== uid && String(booking.passenger._id) !== uid) {
      return res.status(403).json({ error: 'Not authorized to view this booking.' });
    }

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

  const io = req.app.get('io');
  if (io) io.to(`user:${booking.passenger}`).emit('booking:updated', booking);

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

    const updatedRide = await Ride.findByIdAndUpdate(booking.ride, { $inc: { seatsAvailable: booking.seats } }, { new: true });

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.passenger}`).emit('booking:updated', booking);
      io.emit('ride:updated', { rideId: booking.ride.toString(), seatsAvailable: updatedRide.seatsAvailable });
    }

    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/cancel  (Passenger cancels)
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, passenger: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.status === 'cancelled') return res.json({ booking });

    booking.status = 'cancelled';
    booking.cancelReason = req.body.reason || '';
    await booking.save();

    const updatedRide = await Ride.findByIdAndUpdate(
      booking.ride,
      { $inc: { seatsAvailable: booking.seats } },
      { new: true }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.driver}`).emit('booking:updated', booking);
      io.emit('ride:updated', { rideId: booking.ride.toString(), seatsAvailable: updatedRide.seatsAvailable });
    }

    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/start  (DRIVER ONLY — must enter passenger's OTP)  Body: { otp }
router.patch('/:id/start', protect, async (req, res) => {
  try {
    const { otp } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, driver: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.status !== 'upcoming') {
      return res.status(400).json({ error: 'This trip cannot be started right now.' });
    }
    if (!otp || String(otp) !== String(booking.otp)) {
      return res.status(400).json({ error: 'Incorrect OTP. Ask the passenger for their pickup code.' });
    }

    booking.status = 'ongoing';
    booking.progress = 0.1;
    await booking.save();

    // 👇 NAYA: gaadi nikal chuki — ride ab "active/bookable" nahi rahni chahiye
    await Ride.findByIdAndUpdate(booking.ride, { status: 'ongoing' });

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.driver}`).emit('booking:updated', booking);
      io.to(`user:${booking.passenger}`).emit('booking:updated', booking);
      io.emit('ride:updated', { rideId: booking.ride.toString() }); // 👈 taaki Home/Search bhi live hat jaaye
    }

    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/complete  (DRIVER ONLY)
router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, driver: req.user._id });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.status !== 'ongoing') return res.status(400).json({ error: 'Trip is not ongoing.' });

    booking.status = 'completed';
    booking.progress = 1;
    await booking.save();
    await require('../models/User').findByIdAndUpdate(booking.passenger, { $inc: { tripsCount: 1 } });

    // 👇 NAYA
    await Ride.findByIdAndUpdate(booking.ride, { status: 'completed' });

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.driver}`).emit('booking:updated', booking);
      io.to(`user:${booking.passenger}`).emit('booking:updated', booking);
      io.emit('ride:updated', { rideId: booking.ride.toString() });
    }

    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/rate  (Passenger rates driver)
// PATCH /api/bookings/:id/rate  (Passenger rates driver)
router.patch('/:id/rate', protect, async (req, res) => {
  try {
    const { rating, text } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    if (booking.rated) return res.status(400).json({ error: 'This trip has already been rated.' });

    booking.rated = true;
    booking.myRating = rating;
    booking.myReview = text;
    await booking.save();

    const User = require('../models/User');
    const driver = await User.findById(booking.driver);
    const newCount = driver.ratingCount + 1;
    driver.rating = ((driver.rating * driver.ratingCount) + rating) / newCount;
    driver.ratingCount = newCount;
    await driver.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.driver}`).emit('booking:updated', booking);
      io.to(`user:${booking.passenger}`).emit('booking:updated', booking);
    }

    res.json({ booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;