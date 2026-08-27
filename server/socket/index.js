const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Chat = require('../models/Chat');

// Handles real-time chat (persist to Mongo + broadcast) and
// WebRTC call signaling (offer/answer/ICE relay — no media touches this server).
function initSocket(io) {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error('No token provided'));
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('name');
            if (!user) return next(new Error('User not found'));
            socket.userId = user._id.toString();
            socket.userName = user.name;
            next();
        } catch (err) {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        socket.join(`user:${socket.userId}`);

        // ---- Chat ----
        socket.on('chat:send', async ({ chatId, text }, ack) => {
            try {
                if (!text || !text.trim()) return ack?.({ ok: false, error: 'Empty message.' });
                const chat = await Chat.findById(chatId);
                if (!chat) return ack?.({ ok: false, error: 'Chat not found.' });
                if (!chat.participants.some((p) => p.toString() === socket.userId)) {
                    return ack?.({ ok: false, error: 'Not a participant of this chat.' });
                }

                chat.messages.push({ sender: socket.userId, text: text.trim() });
                await chat.save();
                const saved = chat.messages[chat.messages.length - 1];

                const payload = {
                    chatId,
                    message: {
                        _id: saved._id.toString(),
                        sender: socket.userId,
                        text: saved.text,
                        createdAt: saved.createdAt,
                    },
                };

                chat.participants.forEach((p) => {
                    io.to(`user:${p.toString()}`).emit('chat:message', payload);
                });

                ack?.({ ok: true, message: payload.message });
            } catch (err) {
                ack?.({ ok: false, error: err.message });
            }
        });

        // ---- WebRTC call signaling (audio only, peer-to-peer) ----
        socket.on('call:offer', ({ toUserId, chatId, offer }) => {
            io.to(`user:${toUserId}`).emit('call:incoming', {
                chatId, offer, fromUserId: socket.userId, fromUserName: socket.userName,
            });
        });
        socket.on('call:answer', ({ toUserId, answer }) => {
            io.to(`user:${toUserId}`).emit('call:answer', { answer, fromUserId: socket.userId });
        });
        socket.on('call:ice-candidate', ({ toUserId, candidate }) => {
            io.to(`user:${toUserId}`).emit('call:ice-candidate', { candidate, fromUserId: socket.userId });
        });
        socket.on('call:decline', ({ toUserId }) => {
            io.to(`user:${toUserId}`).emit('call:declined', { fromUserId: socket.userId });
        });
        socket.on('call:end', ({ toUserId }) => {
            io.to(`user:${toUserId}`).emit('call:ended', { fromUserId: socket.userId });
        });
    });
}

module.exports = initSocket;