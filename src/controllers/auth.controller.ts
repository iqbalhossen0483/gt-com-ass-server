import jwt from 'jsonwebtoken';
import config from '../config/config';
import asyncHandler from '../libs/asyncHandle';

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

export { register };
