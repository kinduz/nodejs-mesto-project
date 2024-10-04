import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import 'dotenv/config';

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66fe35ce85a727019d278504',
  };
  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
