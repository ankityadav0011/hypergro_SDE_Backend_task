import { Request, Response } from 'express';
 import Property from '../models/property.model';
import Favorite from '../models/favorite.model';
import { getCache, setCache, clearCache } from '../utils/cache';

export const addFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const favorite = await Favorite.create({
      user: req.user?.id,
      property: req.body.propertyId,
    });
    await clearCache(`user:${req.user?.id}:favorites`);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    await Favorite.deleteOne({ user: req.user?.id, property: req.params.propertyId });
    await clearCache(`user:${req.user?.id}:favorites`);
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = `user:${req.user?.id}:favorites`;

    const cached = await getCache(key);
    if (cached) {res.json(cached);
      return;
    }

    const favorites = await Favorite.find({ user: req.user?.id }).populate('property');
    await setCache(key, favorites);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



export const updateFavoriteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const userId = req.user?.id;
    const updateData = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
       res.status(404).json({ message: 'Property not found' });
      return;
    }

    if (property.createdBy.toString() !== userId) {
       res.status(403).json({
        message: 'Unauthorized: You can only update your own property'
      });
      return;
    }

    const updated = await Property.findByIdAndUpdate(propertyId, updateData, { new: true });

    
    await clearCache(); 
    await clearCache(`user:${userId}:favorites`); 

    res.json(updated);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
