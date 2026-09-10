const rateLimit = require('express-rate-limit');

// Login/signup/forgot-password ke liye strict limit
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10,
    message: { error: 'Too many attempts. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// OTP verify ke liye alag se (thoda tighter — brute force otp guess na ho sake)
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: { error: 'Too many OTP attempts. Please request a new OTP.' },
});

// General API limiter (poore app ke liye ek base safety net)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { error: 'Too many requests. Slow down a bit.' },
});

module.exports = { authLimiter, otpLimiter, generalLimiter };       