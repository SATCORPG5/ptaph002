import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFromDb, updateCreatorInDb, saveCreatorsToDb } from '@/lib/creators-db';
import { sendEmailVerification } from '@/lib/auth/email';
import { createToken } from '@/lib/auth/tokens';
import { generateToken } from '@/lib/auth';
import { Creator } from '@/lib/creators';

export async function POST(request: NextRequest) {
  const { tiktokOpenId, displayName, handle, bio, email, avatarUrl } = await request.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  if (!displayName) return NextResponse.json({ error: 'Display name is required' }, { status: 400 });

  const creators = await getCreatorsFromDb();

  // Find existing by tiktokOpenId or handle
  let creator = creators.find(
    c => (tiktokOpenId && c.tiktokOpenId === tiktokOpenId)
      || (handle && c.handle.toLowerCase() === handle.toLowerCase())
  );

  if (!creator) {
    // Create new creator stub
    const newCreator: Creator = {
      id: generateToken(8),
      name: displayName,
      handle: handle || `@${email.split('@')[0]}`,
      description: bio || '',
      image: avatarUrl || '/branding/KYRAX425.png',
      category: [],
      stats: { followers: 'New', avgWatchTime: 'N/A', peakCCV: 'N/A', totalLikes: '0' },
      tags: [],
      tier: 'new',
      socials: { tiktok: handle ? `https://www.tiktok.com/${handle}` : '' },
      email,
      tiktokOpenId: tiktokOpenId || undefined,
      accountStatus: 'pending_onboarding',
      emailVerified: false,
    };
    await saveCreatorsToDb([...creators, newCreator]);
    creator = newCreator;
  } else {
    // Update existing
    await updateCreatorInDb({
      ...creator,
      name: displayName,
      description: bio || creator.description,
      image: avatarUrl || creator.image,
      email: email || creator.email,
      tiktokOpenId: tiktokOpenId || creator.tiktokOpenId,
      accountStatus: creator.accountStatus || 'pending_onboarding',
    });
  }

  // Send email verification
  try {
    const token = await createToken('email_verify', { userId: creator.id, email });
    await sendEmailVerification(email, token);
  } catch {}

  return NextResponse.json({ success: true, creatorId: creator.id });
}
