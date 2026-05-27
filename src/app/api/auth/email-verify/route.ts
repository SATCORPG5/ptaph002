import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';
import { consumeToken, createToken } from '@/lib/auth/tokens';
import { sendEmailVerification } from '@/lib/auth/email';

// POST /api/auth/email-verify  { action: 'send', creatorId }
// POST /api/auth/email-verify  { action: 'confirm', token }
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (body.action === 'send') {
    const { creatorId } = body;
    if (!creatorId) return NextResponse.json({ error: 'Missing creatorId' }, { status: 400 });

    const creators = await getCreatorsFromDb();
    const creator = creators.find(c => c.id === creatorId);
    if (!creator?.email) return NextResponse.json({ error: 'No email on file' }, { status: 400 });

    const token = await createToken('email_verify', { userId: creatorId, email: creator.email });
    await sendEmailVerification(creator.email, token);
    return NextResponse.json({ success: true });
  }

  if (body.action === 'confirm') {
    const { token } = body;
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const data = await consumeToken('email_verify', token);
    if (!data) return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 });

    const creators = await getCreatorsFromDb();
    const creator = creators.find(c => c.id === data.userId);
    if (!creator) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

    await updateCreatorInDb({ ...creator, emailVerified: true });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
