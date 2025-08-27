"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rateLimit_1 = require("../config/rateLimit");
const auth_route_1 = __importDefault(require("./auth.route"));
const health_route_1 = __importDefault(require("./health.route"));
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    res.status(200).json({ message: 'Welcome to the API' });
});
// Routes
router.use('/health', health_route_1.default);
router.use('/auth', (0, rateLimit_1.createRateLimiter)(15), auth_route_1.default);
exports.default = router;
