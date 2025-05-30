import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import Property from '../models/property.model';
import User from '../models/user.model';

export const importCSV = async (filePath: string) => {
  const users = await User.find({}, '_id').lean();
  if (users.length === 0) {
    console.error('No users found.');
    return;
  }

  const userIds = users.map(user => user._id.toString());
  let userIndex = 0;

  const properties: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Validate required fields
      const areaSqFt = Number(row.areaSqFt);
      const bedrooms = Number(row.bedrooms);
      const bathrooms = Number(row.bathrooms);
      const price = Number(row.price);

      if (
        !row.title ||
        !row.type ||
        isNaN(price) ||
        !row.state ||
        !row.city ||
        isNaN(areaSqFt) ||
        isNaN(bedrooms) ||
        isNaN(bathrooms)
      ) {
        console.warn('Skipping invalid row:', row);
        return;
      }

      const createdBy = new mongoose.Types.ObjectId(userIds[userIndex % userIds.length]);
      userIndex++;

      properties.push({
        id: row.id,
        title: row.title,
        type: row.type,
        price,
        state: row.state,
        city: row.city,
        areaSqFt,
        bedrooms,
        bathrooms,
        amenities: row.amenities ? row.amenities.split(',').map((a: string) => a.trim()) : [],
        furnished: row.furnished,
        availableFrom: row.availableFrom ? new Date(row.availableFrom) : undefined,
        listedBy: row.listedBy,
        tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
        colorTheme: row.colorTheme,
        rating: row.rating ? Number(row.rating) : undefined,
        isVerified: row.isVerified === 'true' || row.isVerified === true,
        listingType: row.listingType,
        createdBy,
      });
    })
    .on('end', async () => {
      try {
        await Property.insertMany(properties);
        console.log(`${properties.length} valid properties imported.`);
      } catch (err) {
        console.error('Import failed:', err);
      }
    });
};
