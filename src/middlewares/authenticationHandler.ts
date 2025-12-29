import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import config from '../config/config';
import Token from '../models/Token';

export const authenticationHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw {
        status: 401,
        message: 'You are not authorized to access this resource',
      };
    }
    const decoded = verify(token, config.tokenSecret);

    if (typeof decoded === 'string' || !decoded.id) {
      throw {
        status: 401,
        message: 'You are not authorized to access this resource',
      };
    }

    // check is it a our system generated valid token
    const tokenExists = await Token.findOne({ token });
    if (!tokenExists) {
      throw {
        status: 401,
        message: 'You are not authorized to access this resource',
      };
    }

    req.user = decoded as JwtPayload & TokenPayload;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};
