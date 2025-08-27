import jwt from 'jsonwebtoken';
import config from '../config/config';
import asyncHandler from '../libs/asyncHandle';
import Token from '../models/Token';

// register user
const register = asyncHandler(async (req, res) => {
  const { database, number, password } = req.body;

  // check if all fields are filled
  if (!database || !number || !password) {
    throw {
      status: 400,
      message: 'All fields are required',
    };
  }

  // check if user already exists
  const userExists = await database.User.findOne({ number });
  if (userExists) {
    throw {
      status: 400,
      message: 'User already exists',
    };
  }

  const user = await database.User.create({
    number,
    password,
    database,
  });

  // create token
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.tokenSecret,
    {
      expiresIn: '1d',
    },
  );

  // save the token in the database
  await Token.create({
    userId: user._id,
    token,
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
    user,
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { number, password, database } = req.body;

  // check if all fields are filled
  if (!database || !number || !password) {
    throw {
      status: 400,
      message: 'All fields are required',
    };
  }

  // check if user exists
  const user = await database.User.findOne({ number });
  if (!user) {
    throw {
      status: 400,
      message: 'User does not exist',
    };
  }

  // check if password is correct
  if (user.password !== password) {
    throw {
      status: 400,
      message: 'Incorrect password',
    };
  }

  // create token
  const token = jwt.sign(
    {
      id: user._id,
    },
    config.tokenSecret,
    {
      expiresIn: '1d',
    },
  );

  // save the token in the database
  await Token.create({
    userId: user._id,
    token,
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
    user,
    token,
  });
});

const logout = asyncHandler(async (req, res) => {
  // check if user is logged in
  if (!req.cookies.token) {
    throw {
      status: 400,
      message: 'User is not logged in',
    };
  }

  // make this token invalid
  await Token.findOneAndDelete({ token: req.cookies.token });

  // clear cookie
  res.clearCookie('token');
  res.status(200).json({
    message: 'User logged out successfully',
  });
});

export { login, logout, register };
