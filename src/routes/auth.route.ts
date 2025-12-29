import express from 'express';
import {
  getProfile,
  getUsers,
  login,
  logout,
  register,
} from '../controllers/auth.controller';
import { authenticationHandler } from '../middlewares/authenticationHandler';
import validationHandler from '../middlewares/validationHandler';
import { loginSchema, registerSchema } from '../validations/auth.validations';

const router = express.Router();

router.post('/register', validationHandler(registerSchema), register);
router.post('/login', validationHandler(loginSchema), login);
router.get('/get-profile', authenticationHandler, getProfile);
router.post('/logout', authenticationHandler, logout);
router.get('/users', getUsers);

export default router;
