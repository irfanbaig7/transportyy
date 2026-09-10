const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const razorpay = require('../config/razorpay');
const Ride = require('../models/Ride');

// POST /api/payments/create-order  { rideId, seats }
// Booking create karne SE PEHLE payment order banate hain.
router.post('/create-order', protect, async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(503).json({ error: 'Payments not configured yet.' });
  }

  const { rideId, seats = 1 } = req.body;
  const ride = await Ride.findById(rideId);
  if (!ride) return res.status(404).json({ error: 'Ride not found.' });
  if (ride.seatsAvailable < seats) return res.status(400).json({ error: 'Not enough seats available.' });

  const platformFee = 20;
  const amountInPaise = (ride.price * seats + platformFee) * 100; // Razorpay paise me leta hai

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: `ride_${rideId}_${Date.now()}`,
    notes: { rideId, seats: String(seats), userId: req.user._id.toString() },
  });

  res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
});

// POST /api/payments/verify  { orderId, paymentId, signature }
// Razorpay checkout ke baad frontend yeh call karega — signature verify karke
// hum confirm karte hain ki payment genuinely Razorpay se hi hua hai (tampering nahi).
router.post('/verify', protect, async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expectedSignature !== signature) {
    return res.status(400).json({ error: 'Payment verification failed. Signature mismatch.' });
  }

  res.json({ verified: true, paymentId });
});

module.exports = router;