const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the MONGO_URI from server/.env
 *
 * The server will NOT crash if the URI is missing or still a placeholder —
 * it just logs a warning so you can start the app, then paste your real URI
 * into server/.env and restart.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('paste-your-mongodb-uri-here')) {
    console.warn('\n⚠️  MONGO_URI is not set.');
    console.warn('   Open server/.env and paste your MongoDB connection string,');
    console.warn('   then restart the server. (App keeps running for now.)\n');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('   Check your MONGO_URI in server/.env (and IP allowlist if using Atlas).');
  }
};

module.exports = connectDB;
