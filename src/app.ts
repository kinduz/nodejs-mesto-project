import 'dotenv/config';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { celebrate, errors } from 'celebrate';
import cors from 'cors';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { NOT_FOUND_ERROR_CODE } from './shared';
import { login, createUser } from './controllers/auth';
import {
  auth, errorHandler, errorLogger, requestLogger,
} from './middlewares';

import { signinSchema, signupSchema } from './schemas';

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post('/signin', celebrate(signinSchema), login);
app.post('/signup', celebrate(signupSchema), createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);

app.use((req: Request, res: Response) => {
  res.status(NOT_FOUND_ERROR_CODE).json({ message: 'Страница не найдена' });
});

app.use(errors());
app.use(errorHandler);
app.use(errorLogger);

app.listen(PORT);
