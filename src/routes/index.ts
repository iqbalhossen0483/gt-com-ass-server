import express from 'express';
import { createRateLimiter } from '../config/rateLimit';
import authRoute from './auth.route';
import healthRoute from './health.route';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// Routes
router.use('/health', healthRoute);
router.use('/auth', createRateLimiter(15), authRoute);

export default router;
