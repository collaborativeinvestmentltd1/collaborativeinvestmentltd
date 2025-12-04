// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiting for admin endpoints
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Too many admin requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting for contact form
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact requests per hour
    message: 'Too many contact form submissions, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    adminLimiter,
    contactLimiter
};