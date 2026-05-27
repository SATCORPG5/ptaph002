import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';
import { consumeToken } from '@/lib/auth/tokens';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { token, password } = await request.json().catch(() => ({}));
  if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });

  const data = await consumeToken('password_reset', token);
  if (!data) return NextResponse.json({ error: 'Reset link is invalid or has expired' }, { status: 400 });

  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.id === data.userId);
  if (!creator) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const newHash = await hashPassword(password);
  await updateCreatorInDb({ ...creator, passwordHash: newHash, password: undefined });

  return NextResponse.json({ success: true });
}
