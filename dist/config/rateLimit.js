"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const createRateLimiter = (limit = 100) => {
    return (0, express_rate_limit_1.rateLimit)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: limit, // Limit each IP to `limit` requests per window
        standardHeaders: false, // Return rate limit info in `RateLimit-*` headers
        legacyHeaders: false, // Disable `X-RateLimit-*` headers
        message: 'Too many requests, please try again later.',
        handler: (_req, res) => {
            res.status(429).json({
                message: 'Too many requests, please try again later.',
            });
        },
    });
};
exports.createRateLimiter = createRateLimiter;
