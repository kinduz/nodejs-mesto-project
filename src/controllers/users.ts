import { NextFunction, Request, Response } from 'express';
import {
  AppError,
  DEFAULT_ERROR_CODE, DEFAULT_ERROR_MESSAGE, FORBIDDEN_ERROR_CODE, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE,
} from '../shared';
import User from '../models/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE)));
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new AppError('Пользователь по указанному _id не найден', NOT_FOUND_ERROR_CODE));
      }
      return res.send({ user });
    })
    .catch(() => next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE)));
};

export const getUserInfo = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new AppError('Пользователь не найден', NOT_FOUND_ERROR_CODE));
      }
      return res.send({ user });
    })
    .catch(() => next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE)));
};
export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new AppError('Пользователь с указанным _id не найден', NOT_FOUND_ERROR_CODE));
        return;
      }
      if (user._id.toString() !== req.user._id.toString()) {
        next(new AppError('Нет прав для редактирования пользователя', FORBIDDEN_ERROR_CODE));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError('Переданы некорректные данные при обновлении профиля', INVALID_DATA_ERROR_CODE));
      }
      next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE));
    });
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        next(new AppError('Пользователь с указанным _id не найден', NOT_FOUND_ERROR_CODE));
        return;
      }
      if (user._id.toString() !== req.user._id.toString()) {
        next(new AppError('Нет прав для редактирования пользователя', FORBIDDEN_ERROR_CODE));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError('Переданы некорректные данные при обновлении аватара', INVALID_DATA_ERROR_CODE));
      }
      next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE));
    });
};
