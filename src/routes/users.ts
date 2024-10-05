import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getCurrentUser, getUserInfo, getUsers, updateAvatar, updateUser,
} from '../controllers/users';
import { avatarUpdateSchema, currentUserSchema, userUpdateSchema } from '../schemas';

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);

router.get('/users/:userId', celebrate(currentUserSchema), getCurrentUser);

router.patch('/users/me', celebrate(userUpdateSchema), updateUser);
router.patch('/users/me/avatar', celebrate(avatarUpdateSchema), updateAvatar);

export default router;
