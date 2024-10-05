import mongoose from 'mongoose';
import validator from 'validator';
import { urlValidationRegExp } from '../shared';

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    min: 2,
    max: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    min: 2,
    max: 200,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => urlValidationRegExp.test(v),
      message: (props) => `${props.value} не является корректной ссылкой`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);
