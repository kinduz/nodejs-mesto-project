import mongoose from 'mongoose';
import { urlValidationRegExp } from '../shared';

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return urlValidationRegExp.test(v);
      },
      message: (props) => `${props.value} не является корректной ссылкой`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
