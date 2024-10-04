import mongoose from 'mongoose';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    min: 2,
    max: 30,
  },
  about: {
    type: String,
    required: true,
    min: 2,
    max: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>('user', userSchema);
