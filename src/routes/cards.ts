import { Router } from 'express';
import { celebrate } from 'celebrate';
import { cardIdSchema, createCardSchema } from '../schemas';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', celebrate(createCardSchema), createCard);
router.delete('/cards/:cardId', celebrate(cardIdSchema), deleteCard);

router.put('/cards/:cardId/likes', celebrate(cardIdSchema), likeCard);
router.delete('/cards/:cardId/likes', celebrate(cardIdSchema), dislikeCard);

export default router;
