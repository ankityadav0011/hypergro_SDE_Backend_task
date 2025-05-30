import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import User from './models/user.model';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
  await connectDB();

  const users = [];

  for (let i = 1; i <= 50; i++) {
    users.push({
      name: `User${i}`,
      email: `user${i}@mail.com`,
      password: await bcrypt.hash('password123', 10)
    });
  }

  await User.insertMany(users);
  console.log('50 users inserted.');
  process.exit();
};

seedUsers();
