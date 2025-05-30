import { Request, Response } from 'express';
import User from '../models/user.model';
import Property from '../models/property.model';

export const recommendProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const { propertyId } = req.params;
    const { recipientEmail } = req.body;

    // Find recipient user
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      res.status(404).json({ message: 'Recipient not found' });
      return;
    }

    // Find property
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

   
    recipient.recommendationsReceived = recipient.recommendationsReceived || [];
    recipient.recommendationsReceived.push(property._id);
    await recipient.save();

    res.status(200).json({ message: 'Property recommended successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate('recommendationsReceived');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.recommendationsReceived);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};