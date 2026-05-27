import { NextRequest, NextResponse } from 'next/server';
import { getOnboardingMessages, addOnboardingMessage } from '@/lib/auth/managers';
import { getSessionData, SESSION_COOKIE } from '@/lib/auth/session';
import { getCreatorsFromDb } from '@/lib/creators-db';

export async function GET(request: NextRequest) {
  const creatorId = request.nextUrl.searchParams.get('creatorId');
  if (!creatorId) return NextResponse.json({ error: 'Missing creatorId' }, { status: 400 });

  const messages = await getOnboardingMessages(creatorId);
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  const { creatorId, body } = await request.json().catch(() => ({}));
  if (!creatorId || !body?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  // Determine sender identity
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  let fromId = creatorId;
  let fromName = 'Creator';
  let fromRole: 'creator' | 'manager' | 'admin' = 'creator';

  if (sessionId) {
    const session = await getSessionData(sessionId);
    if (session && session.userId !== creatorId) {
      const creators = await getCreatorsFromDb();
      const sender = creators.find(c => c.id === session.userId);
      if (sender) {
        fromId = sender.id;
        fromName = sender.name;
        fromRole = (sender.tier === 'staff' || sender.tier === 'recruiter') ? 'manager' : 'creator';
      }
    }
  }

  await addOnboardingMessage(creatorId, { fromId, fromName, fromRole, body: body.trim() });
  return NextResponse.json({ success: true });
}
