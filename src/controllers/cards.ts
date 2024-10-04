import { Request, Response } from 'express';
import Card from '../models/card';

const INVALID_DATA_ERROR_CODE = 400;
const NOT_FOUND_ERROR_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

export const likeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};

export const dislikeCard = (req: Request, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ card });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка по умолчанию' });
    });
};
