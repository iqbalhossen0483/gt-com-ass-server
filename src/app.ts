import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config';
import { createRateLimiter } from './config/rateLimit';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes';

const app = express();

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(
  cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// Rate limiter
app.use(createRateLimiter(100));

// Routes
const apiPrefix = config.apiPrefix;
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'The RKB Business Server is running' });
});
app.use(apiPrefix, apiRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
