/**
 * Session utilities — Edge-runtime safe (no Node.js crypto).
 * Import from here in middleware. Import from '@/lib/auth' everywhere else.
 */
import { redis } from '@/lib/redis';

export const SESSION_COOKIE = 'pta_session';

const SESSION_PREFIX = 'pta:auth:session:';
const SESSION_TTL = 60 * 60 * 24 * 7;     // 7 days
const INACTIVITY_TTL = 60 * 60 * 4 * 1000; // 4 h in ms

export interface SessionData {
  userId: string;
  createdAt: number;
  lastActive: number;
  ip?: string;
  userAgent?: string;
  twoFactorVerified?: boolean;
}

export async function getSessionData(sessionId: string): Promise<SessionData | null> {
  try {
    const raw = await redis.get<string | SessionData>(`${SESSION_PREFIX}${sessionId}`);
    if (!raw) return null;
    const data: SessionData = typeof raw === 'string' ? JSON.parse(raw) : raw;

    if (Date.now() - data.lastActive > INACTIVITY_TTL) {
      await redis.del(`${SESSION_PREFIX}${sessionId}`);
      return null;
    }

    data.lastActive = Date.now();
    await redis.setex(`${SESSION_PREFIX}${sessionId}`, SESSION_TTL, JSON.stringify(data));
    return data;
  } catch {
    return null;
  }
}

export async function storeSession(sessionId: string, data: SessionData): Promise<void> {
  await redis.setex(`${SESSION_PREFIX}${sessionId}`, SESSION_TTL, JSON.stringify(data));
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`${SESSION_PREFIX}${sessionId}`);
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
  const indexKey = `pta:auth:user_sessions:${userId}`;
  const ids = (await redis.get<string[]>(indexKey)) ?? [];
  await Promise.all(ids.map(id => redis.del(`${SESSION_PREFIX}${id}`)));
  await redis.del(indexKey);
}

export async function indexUserSession(userId: string, sessionId: string): Promise<void> {
  const indexKey = `pta:auth:user_sessions:${userId}`;
  const existing = (await redis.get<string[]>(indexKey)) ?? [];
  existing.push(sessionId);
  await redis.set(indexKey, existing.slice(-10));
}
