import { NextRequest, NextResponse } from 'next/server';
import { getAssignmentById, updateAssignmentStatus, addToPool, removeFromPool, pushNotification } from '@/lib/auth/managers';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';
import { sendCreatorPoolAlert, sendAdminAlert, sendManagerDeniedNotice } from '@/lib/auth/email';
import { getSessionData, SESSION_COOKIE } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  // Verify the responder is a manager/staff
  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const session = await getSessionData(sessionId);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const creators = await getCreatorsFromDb();
  const manager = creators.find(c => c.id === session.userId);
  if (!manager || (manager.tier !== 'recruiter' && manager.tier !== 'staff')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { assignmentId, action, notes } = await request.json().catch(() => ({}));
  if (!assignmentId || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const assignment = await getAssignmentById(assignmentId);
  if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  if (assignment.managerId !== session.userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const creator = creators.find(c => c.id === assignment.creatorId);
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

  if (action === 'accept') {
    await updateAssignmentStatus(assignmentId, 'accepted', notes);
    await removeFromPool(creator.id);
    await updateCreatorInDb({
      ...creator,
      managerId: manager.id,
      accountStatus: 'active',
      onboardingCompleted: true,
    });
    await pushNotification({
      recipientId: creator.id,
      type: 'assignment_accepted',
      title: 'Manager Accepted',
      message: `${manager.name} has accepted you as your manager. Welcome to the portal!`,
      link: '/portal/home',
    });
    return NextResponse.json({ success: true, action: 'accepted' });
  }

  if (action === 'deny') {
    await updateAssignmentStatus(assignmentId, 'denied', notes);
    await addToPool(creator.id);
    await updateCreatorInDb({ ...creator, accountStatus: 'in_pool' });

    // Notify creator
    if (creator.email) await sendManagerDeniedNotice(creator.email, creator.name);

    // Notify all managers + admins about pool
    const managers = creators.filter(c => c.tier === 'recruiter' || c.tier === 'staff');
    await Promise.all(managers.map(m => m.email
      ? sendCreatorPoolAlert(m.email, m.name, creator.handle)
      : Promise.resolve()
    ));
    await sendAdminAlert(
      'Creator Needs Manager Assignment',
      `${creator.name} (${creator.handle}) was denied by ${manager.name} and has been moved to the Available Creators pool.`
    );
    await pushNotification({
      recipientId: creator.id,
      type: 'assignment_denied',
      title: 'Assignment Update',
      message: 'Your manager request was declined. An admin will assign you a manager shortly.',
    });
    return NextResponse.json({ success: true, action: 'denied' });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
