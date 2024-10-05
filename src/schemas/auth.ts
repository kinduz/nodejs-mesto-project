import Joi from 'joi';

export const signupSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(200).optional(),
    avatar: Joi.string().uri().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const signinSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
