import Joi from 'joi';

export const currentUserSchema = {
  params: Joi.object({
    userId: Joi.string().required(),
  }),
};

export const userUpdateSchema = {
  body: Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(200).optional(),
  }),
};

export const avatarUpdateSchema = {
  body: Joi.object({
    avatar: Joi.string().uri().required(),
  }),
};
