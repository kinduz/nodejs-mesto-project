import { NextFunction, Request, Response } from 'express';
import { AppError, DEFAULT_ERROR_CODE, DEFAULT_ERROR_MESSAGE } from '../shared';

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  if (!err.statusCode) {
    res.status(DEFAULT_ERROR_CODE).send({ message: DEFAULT_ERROR_MESSAGE });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
};
