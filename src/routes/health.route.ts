import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({ message: 'The server is healthy and running' });
});

export default router;
