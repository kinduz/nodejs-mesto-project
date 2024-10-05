import Joi from 'joi';

export const createCardSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
};

export const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
};
