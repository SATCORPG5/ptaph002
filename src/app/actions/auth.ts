'use server';

import { cookies } from 'next/headers';
import { getCreatorsFromDb } from '@/lib/creators-db';
import { Creator } from '@/lib/creators';

const SESSION_COOKIE_NAME = 'pta_creator_session';

export async function signInAction(handle: string, password: string) {
  const creators = await getCreatorsFromDb();
  
  const cleanInput = handle.trim();
  const isEmail = cleanInput.includes('@') && cleanInput.includes('.');
  const normalizedHandle = isEmail ? cleanInput : (cleanInput.startsWith('@') ? cleanInput : `@${cleanInput}`);

  // Match by email or handle
  const creator = creators.find((c) => {
    if (isEmail) {
      return (c as any).email?.toLowerCase() === cleanInput.toLowerCase();
    }
    return c.handle.toLowerCase() === normalizedHandle.toLowerCase();
  });

  if (!creator) {
    return { success: false, error: 'Invalid handle or password' };
  }

  // Allow 1234 as a master password for local testing
  if (password !== '1234' && creator.password !== password) {
    return { success: false, error: 'Invalid handle or password' };
  }

  // Set session cookie (HTTP-only)
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, creator.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { success: true, creatorId: creator.id };
}

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getSession() {
  const cookieStore = await cookies();
  const creatorId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!creatorId) return null;

  const creators = await getCreatorsFromDb();
  return creators.find((c) => c.id === creatorId) || null;
}

import { updateCreatorInDb } from '@/lib/creators-db';

export async function updateCreatorAction(updatedCreator: Creator) {
  const session = await getSession();
  if (!session || session.id !== updatedCreator.id) {
    return { success: false, error: 'Unauthorized' };
  }

  // Protect sensitive fields from being updated via this action
  const { password, id, handle, ...safeData } = updatedCreator;
  const currentCreator = await getSession();
  
  if (!currentCreator) return { success: false, error: 'Unauthorized' };

  const finalUpdate = {
    ...currentCreator,
    ...safeData,
  };

  await updateCreatorInDb(finalUpdate);
  return { success: true, creator: finalUpdate };
}

// Verification & Password Setup
const mockVerificationCodes: Record<string, string> = {};

export async function requestVerificationAction(handle: string) {
  const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.handle.toLowerCase() === normalizedHandle.toLowerCase());

  if (!creator) {
    return { success: false, error: 'Creator not found with this handle' };
  }

  // Mock "sending" a code
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate random 6-digit code
  mockVerificationCodes[normalizedHandle] = code;

  console.log(`[MOCK] Sent verification code ${code} to TikTok DM of ${normalizedHandle}`);
  return { success: true, message: 'Verification code sent to your TikTok DM' };
}

export async function verifyIdentityAction(handle: string, code: string) {
  const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  const storedCode = mockVerificationCodes[normalizedHandle];

  if (code === storedCode) {
    return { success: true };
  }

  return { success: false, error: 'Invalid verification code' };
}

export async function resetPasswordAction(handle: string, code: string, newPassword: string) {
  const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
  
  // Re-verify code for security
  const verifyResult = await verifyIdentityAction(handle, code);
  if (!verifyResult.success) return verifyResult;

  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.handle.toLowerCase() === normalizedHandle.toLowerCase());

  if (!creator) return { success: false, error: 'Creator not found' };

  const updatedCreator = {
    ...creator,
    password: newPassword
  };

  await updateCreatorInDb(updatedCreator);
  delete mockVerificationCodes[normalizedHandle];

  return { success: true };
}
