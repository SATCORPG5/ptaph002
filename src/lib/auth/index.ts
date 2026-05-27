/**
 * Auth utilities — Node.js runtime only (uses crypto).
 * Do NOT import from middleware; use '@/lib/auth/session' there instead.
 */
import { promisify } from 'util';
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';

const scryptAsync = promisify(_scrypt);

// Re-export session helpers and constants so callers can use one import path.
export { SESSION_COOKIE, getSessionData, storeSession, deleteSession, deleteAllUserSessions, indexUserSession } from './session';
export type { SessionData } from './session';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    if (!storedHash.startsWith('scrypt:')) {
      return password === storedHash; // Legacy plain-text fallback
    }
    const [, salt, key] = storedHash.split(':');
    const derived = (await scryptAsync(password, salt, 64)) as Buffer;
    return timingSafeEqual(derived, Buffer.from(key, 'hex'));
  } catch {
    return false;
  }
}

export function generateToken(length = 32): string {
  return randomBytes(length).toString('hex');
}

export async function createSession(
  userId: string,
  meta?: { ip?: string; userAgent?: string },
  twoFactorVerified = false
): Promise<string> {
  const sessionId = generateToken(32);
  const now = Date.now();
  const { storeSession } = await import('./session');
  await storeSession(sessionId, {
    userId,
    createdAt: now,
    lastActive: now,
    twoFactorVerified,
    ...meta,
  });
  return sessionId;
}
