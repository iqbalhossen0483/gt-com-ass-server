import express from 'express';
import {
  getProfile,
  login,
  logout,
  register,
} from '../controllers/auth.controller';
import { authenticationHandler } from '../middlewares/authenticationHandler';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/get-profile', authenticationHandler, getProfile);
router.post('logout', authenticationHandler, logout);

export default router;
