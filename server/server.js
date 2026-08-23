require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- Database ----
// Tries to connect to MongoDB using MONGO_URI from server/.env
// (Server still starts even if the URI is missing, so you can test the stack.)
connectDB();

// ---- Routes ----

// Simple root route
app.get('/', (req, res) => {
  res.send('API is running. Try GET /api/health');
});

// Health check: tells you if the server and the database are up
app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    server: 'running',
    database: states[mongoose.connection.readyState] || 'unknown',
    time: new Date().toISOString(),
  });
});

// Example CRUD routes to prove MongoDB works
app.use('/api/items', require('./routes/itemRoutes'));

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ---- Start server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
