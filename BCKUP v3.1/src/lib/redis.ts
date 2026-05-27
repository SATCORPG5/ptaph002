import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a proxy or a dummy client if environment variables are missing
// This prevents the application from crashing on startup/import
export const redis = (redisUrl && redisToken) 
  ? new Redis({ url: redisUrl, token: redisToken })
  : {
      get: async () => null,
      set: async () => 'OK',
      setex: async () => 'OK',
      del: async () => 1,
      incr: async () => 1,
      expire: async () => 1,
      // Add other methods as needed to prevent "is not a function" errors
    } as unknown as Redis;
