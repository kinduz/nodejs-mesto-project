import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AppError, UNAUTHORIZED_ERROR_CODE } from '../shared';

const { JWT_SECRET = 'jwt_secret' } = process.env;

interface JwtPayload {
  _id: string;
  iat: number;
  exp: number;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AppError('Необходима авторизация', UNAUTHORIZED_ERROR_CODE));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
  } catch (err) {
    next(new AppError('Необходима авторизация', UNAUTHORIZED_ERROR_CODE));
  }

  next();
};
