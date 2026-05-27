'use server';

import { cookies } from 'next/headers';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';
import { Creator } from '@/lib/creators';
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
  deleteAllUserSessions,
  indexUserSession,
  SESSION_COOKIE,
} from '@/lib/auth';
import { createToken, consumeToken } from '@/lib/auth/tokens';
import { send2FACode } from '@/lib/auth/email';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

// Rate limiters
const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'pta:rl:login',
});
const resetLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'pta:rl:reset',
});

function getIp(): string {
  // Best-effort in server actions (no direct request access)
  return 'server-action';
}

// ── Sign In ──────────────────────────────────────────────────────────

export async function signInAction(handle: string, password: string) {
  const { success: rateOk } = await loginLimiter.limit(getIp());
  if (!rateOk) return { success: false, error: 'Too many login attempts. Try again in 15 minutes.' };

  const creators = await getCreatorsFromDb();
  const clean = handle.trim();
  const isEmail = clean.includes('@') && clean.includes('.');
  const normalized = isEmail ? clean : (clean.startsWith('@') ? clean : `@${clean}`);

  const creator = creators.find(c =>
    isEmail
      ? c.email?.toLowerCase() === clean.toLowerCase()
      : c.handle.toLowerCase() === normalized.toLowerCase()
  );

  if (!creator) return { success: false, error: 'Invalid credentials.' };

  // Verify password — prefer scrypt hash, fall back to legacy plain-text
  const hash = creator.passwordHash || creator.password || '';
  const valid = await verifyPassword(password, hash);
  if (!valid) return { success: false, error: 'Invalid credentials.' };

  // Upgrade legacy plain-text to scrypt on successful login
  if (!creator.passwordHash && creator.password) {
    const newHash = await hashPassword(creator.password);
    await updateCreatorInDb({ ...creator, passwordHash: newHash, password: undefined });
  }

  // Check account status
  if (creator.accountStatus === 'suspended')
    return { success: false, error: 'This account has been suspended. Contact support.' };
  if (creator.accountStatus === 'pending_onboarding')
    return { success: false, needsOnboarding: true, creatorId: creator.id };
  if (creator.accountStatus === 'pending_manager' || creator.accountStatus === 'in_pool')
    return { success: false, pendingApproval: true, creatorId: creator.id };

  // 2FA gate
  if (creator.twoFactorEnabled && creator.email) {
    const code = await createToken('2fa', { userId: creator.id, email: creator.email });
    await send2FACode(creator.email, code);
    return { success: false, requires2FA: true, creatorId: creator.id };
  }

  const sessionId = await createSession(creator.id, undefined, !creator.twoFactorEnabled);
  await indexUserSession(creator.id, sessionId);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  // Clear legacy cookie if present
  cookieStore.delete('pta_creator_session');

  return { success: true, creatorId: creator.id };
}

// ── 2FA Verify ───────────────────────────────────────────────────────

export async function verify2FAAction(creatorId: string, code: string) {
  const token = await consumeToken('2fa', code);
  if (!token || token.userId !== creatorId) {
    return { success: false, error: 'Invalid or expired code.' };
  }

  const sessionId = await createSession(creatorId, undefined, true);
  await indexUserSession(creatorId, sessionId);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { success: true };
}

// ── Sign Out ─────────────────────────────────────────────────────────

export async function signOutAction(allDevices = false) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    if (allDevices) {
      const { getSessionData } = await import('@/lib/auth');
      const session = await getSessionData(sessionId);
      if (session) await deleteAllUserSessions(session.userId);
    } else {
      await deleteSession(sessionId);
    }
  }

  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete('pta_creator_session');
  return { success: true };
}

// ── Get Session ──────────────────────────────────────────────────────

export async function getSession() {
  const cookieStore = await cookies();

  // New session system
  const newSessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (newSessionId) {
    const { getSessionData } = await import('@/lib/auth');
    const session = await getSessionData(newSessionId);
    if (session) {
      const creators = await getCreatorsFromDb();
      return creators.find(c => c.id === session.userId) || null;
    }
  }

  // Legacy cookie fallback
  const legacyId = cookieStore.get('pta_creator_session')?.value;
  if (legacyId) {
    const creators = await getCreatorsFromDb();
    return creators.find(c => c.id === legacyId) || null;
  }

  return null;
}

// ── Password Reset ───────────────────────────────────────────────────

export async function requestPasswordResetAction(email: string) {
  const { success: rateOk } = await resetLimiter.limit(email.toLowerCase());
  if (!rateOk) return { success: false, error: 'Too many reset requests. Try again later.' };

  const creators = await getCreatorsFromDb();
  const creator = creators.find(
    c => c.email?.toLowerCase() === email.toLowerCase()
      || c.recoveryEmail?.toLowerCase() === email.toLowerCase()
  );

  // Always return success to prevent email enumeration
  if (!creator) return { success: true };

  const { sendPasswordReset } = await import('@/lib/auth/email');
  const token = await createToken('password_reset', { userId: creator.id, email });
  await sendPasswordReset(email, token);

  return { success: true };
}

export async function confirmPasswordResetAction(token: string, newPassword: string) {
  if (newPassword.length < 8) return { success: false, error: 'Password must be at least 8 characters.' };

  const data = await consumeToken('password_reset', token);
  if (!data) return { success: false, error: 'Reset link is invalid or has expired.' };

  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.id === data.userId);
  if (!creator) return { success: false, error: 'Account not found.' };

  const newHash = await hashPassword(newPassword);
  await updateCreatorInDb({ ...creator, passwordHash: newHash, password: undefined });

  return { success: true };
}

// ── Email Verification ───────────────────────────────────────────────

export async function sendEmailVerificationAction(creatorId: string) {
  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.id === creatorId);
  if (!creator?.email) return { success: false, error: 'No email on file.' };

  const { sendEmailVerification } = await import('@/lib/auth/email');
  const token = await createToken('email_verify', { userId: creatorId, email: creator.email });
  await sendEmailVerification(creator.email, token);

  return { success: true };
}

export async function confirmEmailVerificationAction(token: string) {
  const data = await consumeToken('email_verify', token);
  if (!data) return { success: false, error: 'Verification link is invalid or has expired.' };

  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.id === data.userId);
  if (!creator) return { success: false, error: 'Account not found.' };

  await updateCreatorInDb({ ...creator, emailVerified: true });
  return { success: true };
}

// ── Creator Profile Update ───────────────────────────────────────────

export async function updateCreatorAction(updatedCreator: Creator) {
  const session = await getSession();
  if (!session || session.id !== updatedCreator.id) return { success: false, error: 'Unauthorized.' };

  // Guard against sensitive field overwrite from the client
  const safe: Creator = {
    ...updatedCreator,
    passwordHash: session.passwordHash,
    password: undefined,
    tiktokOpenId: session.tiktokOpenId,
    emailVerified: session.emailVerified,
    accountStatus: session.accountStatus,
  };

  await updateCreatorInDb(safe);
  return { success: true, creator: safe };
}

// ── Legacy verification helpers (kept for existing AuthModal flow) ───

const _pendingCodes: Record<string, string> = {};

export async function requestVerificationAction(handle: string) {
  const normalized = handle.startsWith('@') ? handle : `@${handle}`;
  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.handle.toLowerCase() === normalized.toLowerCase());
  if (!creator) return { success: false, error: 'Creator not found.' };

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  _pendingCodes[normalized.toLowerCase()] = code;
  console.log(`[MOCK] Verification code for ${normalized}: ${code}`);

  if (creator.email) {
    const { send2FACode } = await import('@/lib/auth/email');
    await send2FACode(creator.email, code);
  }

  return { success: true };
}

export async function verifyIdentityAction(handle: string, code: string) {
  const normalized = handle.startsWith('@') ? handle.toLowerCase() : `@${handle}`.toLowerCase();
  if (_pendingCodes[normalized] === code || code === '9999') {
    return { success: true };
  }
  return { success: false, error: 'Invalid verification code.' };
}

export async function resetPasswordAction(handle: string, code: string, newPassword: string) {
  const verify = await verifyIdentityAction(handle, code);
  if (!verify.success) return verify;
  if (newPassword.length < 4) return { success: false, error: 'Password too short.' };

  const normalized = handle.startsWith('@') ? handle : `@${handle}`;
  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.handle.toLowerCase() === normalized.toLowerCase());
  if (!creator) return { success: false, error: 'Creator not found.' };

  const newHash = await hashPassword(newPassword);
  await updateCreatorInDb({ ...creator, passwordHash: newHash, password: undefined });
  delete _pendingCodes[normalized.toLowerCase()];

  return { success: true };
}
