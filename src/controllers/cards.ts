import { NextFunction, Request, Response } from 'express';
import {
  AppError,
  DEFAULT_ERROR_CODE, DEFAULT_ERROR_MESSAGE, FORBIDDEN_ERROR_CODE, INVALID_DATA_ERROR_CODE, NOT_FOUND_ERROR_CODE,
} from '../shared';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(() => next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE)));
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError('Переданы некорректные данные при создании карточки', INVALID_DATA_ERROR_CODE));
      }
      next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE));
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new AppError('Карточка с указанным _id не найдена', NOT_FOUND_ERROR_CODE));
        return;
      }
      if (card.owner !== req.user._id) {
        next(new AppError('Нет прав для удаления этой карточки', FORBIDDEN_ERROR_CODE));
      }
      return res.send({ card });
    })
    .catch(() => next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE)));
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new AppError('Карточка с указанным _id не найдена', NOT_FOUND_ERROR_CODE));
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError('Переданы некорректные данные для постановки лайка', INVALID_DATA_ERROR_CODE));
      }
      next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE));
    });
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new AppError('Карточка с указанным _id не найдена', NOT_FOUND_ERROR_CODE));
      }
      return res.send({ card });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new AppError('Переданы некорректные данные для снятия лайка', INVALID_DATA_ERROR_CODE));
      }
      next(new AppError(DEFAULT_ERROR_MESSAGE, DEFAULT_ERROR_CODE));
    });
};
