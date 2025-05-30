import { Router } from 'express';
import {
  addFavorite,
  getFavorites,
  deleteFavorite,
  updateFavoriteProperty
} from '../controllers/favorite.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', auth, addFavorite);
router.get('/', auth, getFavorites);
router.delete('/:propertyId', auth, deleteFavorite);
router.put('/:propertyId', auth, updateFavoriteProperty);

export default router;
