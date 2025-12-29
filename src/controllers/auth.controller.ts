import jwt from 'jsonwebtoken';
import config from '../config/config';
import asyncHandler from '../libs/asyncHandle';
import { prisma } from '../libs/prisma';

// register user
const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if all fields are filled
  if (!email || !password) {
    throw {
      status: 400,
      message: 'Required fields are missing',
    };
  }

  // check if user already exists
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw {
      status: 400,
      message: 'User already exists',
    };
  }

  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
  });

  // create token
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.tokenSecret,
    {
      expiresIn: '1d',
    },
  );

  // save the token in the database
  await prisma.token.upsert({
    where: { email: user.email },
    update: { token },
    create: {
      email: user.email,
      token,
    },
  });

  // set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: 'User created successfully',
    data: { user, token },
    success: true,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if all fields are filled
  if (!email || !password) {
    throw {
      status: 400,
      message: 'Required fields are missing',
    };
  }

  // check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw {
      status: 400,
      message: 'User does not exist',
    };
  }

  // check if user is active
  if (user.status === 'INACTIVE') {
    throw {
      status: 400,
      message: 'You are suspended. Please contact support.',
    };
  }

  // check if password is correct
  if (user.password !== password) {
    throw {
      status: 400,
      message: 'Invalid credentials',
    };
  }

  // create token
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.tokenSecret,
    {
      expiresIn: '1d',
    },
  );

  // save the token in the database
  await prisma.token.upsert({
    where: { email: user.email },
    update: { token },
    create: {
      email: user.email,
      token,
    },
  });

  // set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'User logged in successfully',
    data: { user, token },
    success: true,
  });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.token;

  if (!token) {
    throw {
      status: 401,
      message: 'User is not logged in',
    };
  }

  // make this token invalid
  await prisma.token.delete({ where: { token } });

  // clear cookie
  res.clearCookie('token');
  res.status(200).json({
    message: 'User logged out successfully',
    success: true,
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const { id } = req.user!;

  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!user) {
    throw {
      status: 400,
      message: 'User does not exist',
    };
  }

  // create new token
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.tokenSecret,
    {
      expiresIn: '1d',
    },
  );

  // save the token in the database
  await prisma.token.upsert({
    where: { email: user.email },
    update: { token },
    create: {
      email: user.email,
      token,
    },
  });

  // set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: 'User profile fetched successfully',
    data: { user, token },
    success: true,
  });
});

export { getProfile, login, logout, register };
