const mongoose = require('mongoose');

// A passenger's booking on a ride = "Trip" in the frontend (My Trips section)
const bookingSchema = new mongoose.Schema(
  {
    ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    seats: { type: Number, required: true, default: 1 },
    pricePerSeat: { type: Number, required: true },
    platformFee: { type: Number, default: 20 },
    total: { type: Number, required: true },

    paymentMethod: { type: String, enum: ['UPI', 'Card', 'Wallet'], default: 'UPI' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },

    // pending = driver hasn't accepted yet, upcoming = accepted, ongoing/completed/cancelled follow trip lifecycle
    status: {
      type: String,
      enum: ['pending', 'upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    cancelReason: String,

    otp: { type: String }, // shown to passenger, driver verifies at pickup
    progress: { type: Number, default: 0 }, // 0 to 1, used for ongoing trip screen

    rated: { type: Boolean, default: false },
    myRating: Number,
    myReview: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);