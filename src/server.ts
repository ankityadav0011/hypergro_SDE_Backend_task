import dotenv from 'dotenv';
dotenv.config();

import app from './app'; 
import connectDB from './config/db';
import redisClient from './config/redis'; 
// import { importCSV } from './utils/csvImporter'; // Uncomment to import once

const startServer = async () => {

  await redisClient.connect();
  console.log('Redis connected hai bossss pani samosa lauu kya =');

  await connectDB();

  

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });


};

startServer();
