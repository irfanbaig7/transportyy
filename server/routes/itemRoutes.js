const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Item = require('../models/Item');

// Small guard so requests fail gracefully if the DB isn't connected yet.
const ensureDB = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database not connected. Paste your MONGO_URI in server/.env and restart the server.',
    });
  }
  next();
};

// GET /api/items  -> list all items (newest first)
router.get('/', ensureDB, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items  -> create a new item  { "name": "..." }
router.post('/', ensureDB, async (req, res) => {
  try {
    const item = await Item.create({ name: req.body.name });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/items/:id  -> remove an item
router.delete('/:id', ensureDB, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
