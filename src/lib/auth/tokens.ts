import { redis } from '@/lib/redis';
import { generateToken } from './index';

export type TokenType = 'email_verify' | 'password_reset' | '2fa' | 'tiktok_state';

const TOKEN_PREFIX = 'pta:auth:token:';
const TTL: Record<TokenType, number> = {
  email_verify:   60 * 60 * 24,  // 24 h
  password_reset: 60 * 30,       // 30 min
  '2fa':          60 * 10,       // 10 min
  tiktok_state:   60 * 10,       // 10 min
};

export interface TokenData {
  type: TokenType;
  userId?: string;
  email?: string;
  createdAt: number;
  [key: string]: unknown;
}

export async function createToken(
  type: TokenType,
  payload: Omit<TokenData, 'type' | 'createdAt'>
): Promise<string> {
  const token = type === '2fa'
    ? Math.floor(100000 + Math.random() * 900000).toString()
    : generateToken(32);

  const data: TokenData = { type, ...payload, createdAt: Date.now() };
  await redis.setex(`${TOKEN_PREFIX}${type}:${token}`, TTL[type], JSON.stringify(data));
  return token;
}

export async function verifyToken(type: TokenType, token: string): Promise<TokenData | null> {
  try {
    const raw = await redis.get<string | TokenData>(`${TOKEN_PREFIX}${type}:${token}`);
    if (!raw) return null;
    const data: TokenData = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return data.type === type ? data : null;
  } catch {
    return null;
  }
}

/** Verify and immediately delete (single-use). */
export async function consumeToken(type: TokenType, token: string): Promise<TokenData | null> {
  const data = await verifyToken(type, token);
  if (!data) return null;
  await redis.del(`${TOKEN_PREFIX}${type}:${token}`);
  return data;
}
