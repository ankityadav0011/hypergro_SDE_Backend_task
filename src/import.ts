import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
import path from 'path';
import { importCSV } from './utils/csvImporter';

const run = async () => {
  await connectDB();
  const filePath = path.resolve(__dirname, './data/excelData.csv');

  await importCSV(filePath);

};

run();
