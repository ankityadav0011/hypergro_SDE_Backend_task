import redisClient from '../config/redis';

export const getCache = async (key: string) => {
  const cached = await redisClient.get(key);
  return cached ? JSON.parse(cached) : null;
};

export const setCache = async (key: string, data: any, ttl = 300) => {
  await redisClient.setEx(key, ttl, JSON.stringify(data));
};

export const clearCache = async (...keys: string[]) => {
  if (keys.length === 0) {
    await redisClient.flushAll();
  } else {
    await redisClient.del(keys);
  }
};
