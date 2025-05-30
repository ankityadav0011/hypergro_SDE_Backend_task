import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

  
const userIdString = user._id.toString();  


const token = jwt.sign(
  { id: userIdString },          
  process.env.JWT_SECRET as string,
  { expiresIn: '1d' }
);
    console.log('User created:', userIdString);
    res.status(201).json({ user,token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    console.log('User_iddddddddddd:', user._id);
    
    const userIdString = user._id.toString(); 
    const token = jwt.sign(
      { id: userIdString },          
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
        console.log('User created:', user._id);
        res.status(201).json({user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
