import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { AppError, UNAUTHORIZED_ERROR_CODE } from '../shared';

const { JWT_SECRET } = process.env;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AppError('Необходима авторизация', UNAUTHORIZED_ERROR_CODE));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  try {
    const payload: any = jwt.verify(token, JWT_SECRET as string);

    req.user = payload;
  } catch (err) {
    next(new AppError('Необходима авторизация', UNAUTHORIZED_ERROR_CODE));
  }

  next();
};
