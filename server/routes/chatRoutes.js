const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Chat = require('../models/Chat');

// GET /api/chats  (Chat List screen)
router.get('/', protect, async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', 'name')
    .sort({ updatedAt: -1 });
  res.json({ chats });
});

// GET /api/chats/:id  (Chat Thread screen)
router.get('/:id', protect, async (req, res) => {
  const chat = await Chat.findById(req.params.id).populate('participants', 'name').populate('messages.sender', 'name');
  if (!chat) return res.status(404).json({ error: 'Chat not found.' });
  res.json({ chat });
});

// POST /api/chats/:id/messages  Body: { text }
router.post('/:id/messages', protect, async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return res.status(404).json({ error: 'Chat not found.' });
  chat.messages.push({ sender: req.user._id, text: req.body.text });
  await chat.save();
  res.status(201).json({ chat });
});

// POST /api/chats  Body: { otherUserId }  (start a chat if not already existing)
router.post('/', protect, async (req, res) => {
  const { otherUserId } = req.body;
  let chat = await Chat.findOne({ participants: { $all: [req.user._id, otherUserId] } });
  if (!chat) chat = await Chat.create({ participants: [req.user._id, otherUserId] });
  res.status(201).json({ chat });
});

module.exports = router;