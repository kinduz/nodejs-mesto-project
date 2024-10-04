import { Router } from 'express';
import {
  createUser, getCurrentUser, getUsers, updateAvatar, updateUser,
} from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', getCurrentUser);
router.post('/users', createUser);

router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

export default router;
