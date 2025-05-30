import { Router } from 'express';
import {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty
} from '../controllers/property.controller';
import {
  recommendProperty,
  getRecommendations
} from '../controllers/recommendation.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProperties);
router.post('/', auth, createProperty);
router.put('/:id', auth, updateProperty);
router.delete('/:id', auth, deleteProperty);
router.post('/:propertyId/recommend', auth, recommendProperty);
router.get('/recommendations', auth, getRecommendations);

export default router;
