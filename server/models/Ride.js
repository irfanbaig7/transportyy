const mongoose = require('mongoose');

// A ride posted by a driver (matches Post-a-Ride screens in the frontend)
const rideSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    from: { type: String, required: true },
    to: { type: String, required: true },
    via: String,

    date: { type: String, required: true }, // kept as display string to match frontend, e.g. "22 May 2025"
    time: { type: String, required: true },

    seatsTotal: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
    price: { type: Number, required: true },

    status: { type: String, enum: ['active', 'completed', 'cancelled', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);