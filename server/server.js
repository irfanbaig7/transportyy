require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const initSocket = require('./socket');

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Database ----
connectDB();

// ---- Routes ----
app.get('/', (req, res) => {
  res.send('API is running. Try GET /api/health');
});

app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    server: 'running',
    database: states[mongoose.connection.readyState] || 'unknown',
    time: new Date().toISOString(),
  });
});

app.use('/api/items', require('./routes/itemRoutes'));

// ---- Chalo app routes ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/rides', require('./routes/rideRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---- HTTP server + Socket.io (real-time chat & call signaling) ----
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});
initSocket(io);

// ---- Start server ----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Socket.io ready for real-time chat & calls\n`);
}); 