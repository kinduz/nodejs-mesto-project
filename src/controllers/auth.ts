import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {
  DEFAULT_ERROR_CODE, UNAUTHORIZED_ERROR_CODE, DEFAULT_ERROR_MESSAGE, AppError,
  INVALID_DATA_ERROR_CODE,
  DUPLICATE_ERROR_CODE,
} from '../shared';

const { JWT_SECRET } = process.env;

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AppError('Неправильные почта или пароль', UNAUTHORIZED_ERROR_CODE));
        return;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AppError('Неправильные почта или пароль', UNAUTHORIZED_ERROR_CODE));
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET as string, { expiresIn: '7d' });

          res.cookie('token', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.send({ token });
        });
    })
    .catch(() => {
      next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE));
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError('Переданы некорректные данные при создании пользователя', INVALID_DATA_ERROR_CODE));
      }
      if (err.code === 11000) {
        next(new AppError('Пользователь с таким email уже существует', DUPLICATE_ERROR_CODE));
      }
      return next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE));
    });
};
