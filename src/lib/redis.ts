import { Redis } from '@upstash/redis';

// ── In-memory mock for local development ────────────────────────────────────
// Used when UPSTASH_REDIS_REST_URL is not set.
// Data persists for the lifetime of the dev server process (resets on restart).

const store = new Map<string, { value: string; expiresAt?: number }>();

function isExpired(entry: { value: string; expiresAt?: number }) {
  return entry.expiresAt !== undefined && Date.now() > entry.expiresAt;
}

const inMemoryRedis = {
  async get<T = unknown>(key: string): Promise<T | null> {
    const entry = store.get(key);
    if (!entry || isExpired(entry)) { if (entry) store.delete(key); return null; }
    try { return JSON.parse(entry.value) as T; } catch { return entry.value as unknown as T; }
  },
  async set(key: string, value: unknown): Promise<'OK'> {
    store.set(key, { value: typeof value === 'string' ? value : JSON.stringify(value) });
    return 'OK';
  },
  async setex(key: string, ttlSeconds: number, value: unknown): Promise<'OK'> {
    store.set(key, {
      value: typeof value === 'string' ? value : JSON.stringify(value),
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return 'OK';
  },
  async del(key: string): Promise<number> {
    return store.delete(key) ? 1 : 0;
  },
  async expire(key: string, ttlSeconds: number): Promise<number> {
    const entry = store.get(key);
    if (!entry) return 0;
    entry.expiresAt = Date.now() + ttlSeconds * 1000;
    return 1;
  },
  async incr(key: string): Promise<number> {
    const entry = store.get(key);
    const current = entry ? parseInt(entry.value, 10) || 0 : 0;
    const next = current + 1;
    store.set(key, { value: String(next), expiresAt: entry?.expiresAt });
    return next;
  },
  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return [...store.keys()].filter(k => regex.test(k));
  },
  /** Dev-only: dump all keys (for the /api/dev/state endpoint). */
  _dump() { return Object.fromEntries([...store.entries()].map(([k, v]) => [k, v.value])); },
};

// ── Export real or mock ────────────────────────────────────────────────────
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = (redisUrl && redisToken)
  ? new Redis({ url: redisUrl, token: redisToken })
  : inMemoryRedis as unknown as Redis;

export const isUsingMockRedis = !(redisUrl && redisToken);
