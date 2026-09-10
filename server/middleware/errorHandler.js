// Catches every error thrown in async routes (thanks to express-async-errors)
// so the server never crashes/hangs on a bad request.
function errorHandler(err, req, res, next) {
    console.error('❌ Error:', err.message);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format.' });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: messages.join(', ') });
    }

    // Duplicate key (e.g. phone already exists)
    if (err.code === 11000) {
        return res.status(409).json({ error: 'This value is already in use.' });
    }

    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Something went wrong. Please try again.' });
}

module.exports = { errorHandler };