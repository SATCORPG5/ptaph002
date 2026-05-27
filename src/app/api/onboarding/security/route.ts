import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { creatorId, password, recoveryEmail, enable2FA } = await request.json().catch(() => ({}));
  if (!creatorId || !password || !recoveryEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.id === creatorId);
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

  const passwordHash = await hashPassword(password);
  await updateCreatorInDb({
    ...creator,
    passwordHash,
    password: undefined,
    recoveryEmail,
    twoFactorEnabled: !!enable2FA,
    accountStatus: 'pending_manager',
  });

  return NextResponse.json({ success: true });
}
