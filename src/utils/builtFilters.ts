// utils/buildFilters.ts
import mongoose from 'mongoose';
import { filterMap } from '../types/filter-map';

export function buildFilters(raw: Record<string, any>) {
  const filters: Record<string, any> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (!filterMap[key] || value == null) continue;

    // Convert _id to ObjectId
    if (key === '_id' && typeof value === 'string') {
      try {
        filters._id =  new mongoose.Types.ObjectId(value);
      } catch {
      
      }
      continue;
    }

    switch (filterMap[key]) {
      case 'number':
        const num = Number(value);
        if (!isNaN(num)) filters[key] = num;
        break;

      case 'boolean':
        filters[key] = value === 'true' || value === true;
        break;

      case 'date':
        const d = new Date(value);
        if (!isNaN(d.getTime())) filters[key] = d;
        break;

      case 'array':
        // split comma-separated list into an $in query
        filters[key] = { $in: (value as string).split(',') };
        break;

      case 'string':
      default:
        filters[key] = value;
    }
  }

  return filters;
}
