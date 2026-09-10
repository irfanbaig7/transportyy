require('dotenv').config();
require('express-async-errors'); // 👈 NEW — async route errors auto-catch hote hain

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const initSocket = require('./socket');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ---- Security & perf middleware ----
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? [process.env.CLIENT_URL || 'https://yourapp.com']
    : '*',
}));
app.use(express.json({ limit: '2mb' }));

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
app.use('/api/payments', require('./routes/paymentRoutes'));   // 👈 NEW
app.use('/api/admin', require('./routes/adminRoutes'));        // 👈 NEW
app.use('/api/upload', require('./routes/uploadRoutes'));      // 👈 NEW

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---- Global error handler (must be LAST) ----
app.use(errorHandler); // 👈 NEW

// ---- HTTP server + Socket.io ----
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.CLIENT_URL || 'https://yourapp.com']
      : '*',
  },
});
initSocket(io);
app.set('io', io);

// ---- Start server ----
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Socket.io ready for real-time chat & calls\n`);
});