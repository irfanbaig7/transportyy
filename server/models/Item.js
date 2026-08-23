const mongoose = require('mongoose');

// A tiny example model so you can see data being saved to MongoDB.
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model('Item', itemSchema);
