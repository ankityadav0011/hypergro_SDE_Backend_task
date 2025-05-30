import { Request, Response } from 'express';
import Property from '../models/property.model';
import { buildFilters } from '../utils/builtFilters';
import { getCache, setCache, clearCache } from '../utils/cache';  
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user?.id){ res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const data = { ...req.body, createdBy: req.user.id };
    const property = await Property.create(data);

    await clearCache(); // Clear all property cache
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property || property.createdBy?.toString() !== req.user?.id){
       res.status(403).json({ message: 'Unauthorized' });
       return;
    }
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    Object.assign(property, req.body);
    await property.save();
    await clearCache();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property || property.createdBy?.toString() !== req.user?.id){
     res.status(403).json({ message: 'Unauthorized' });
     return;
    }
    if (!property) {res.status(404).json({ message: 'Property not found' });
     return;}

    await property.deleteOne();
    await clearCache();
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawFilters = req.query;
    const filters = buildFilters(rawFilters as Record<string, any>);
    const key = `properties:${JSON.stringify(rawFilters)}`;
    
    console.log("filters:", filters);
    const cached = await getCache(key);
    if (cached && cached.length > 0) {
      res.json(cached);
      return;
    }
    console.log('Fetching from database with filters:', filters);
    const properties = await Property.find(filters);
    console.log('Fetched properties:', properties);
    await setCache(key, properties);
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


