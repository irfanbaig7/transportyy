const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['booking', 'payment', 'trip', 'rating', 'promo'], required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);