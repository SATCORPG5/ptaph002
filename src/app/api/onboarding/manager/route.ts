import { NextRequest, NextResponse } from 'next/server';
import { getCreatorsFromDb, updateCreatorInDb } from '@/lib/creators-db';
import {
  createAssignment,
  addToPool,
  pushNotification,
  getManagers,
} from '@/lib/auth/managers';
import {
  sendManagerAssignmentRequest,
  sendCreatorPoolAlert,
  sendAdminAlert,
} from '@/lib/auth/email';

export async function POST(request: NextRequest) {
  const { creatorId, managerId } = await request.json().catch(() => ({}));
  if (!creatorId) return NextResponse.json({ error: 'Missing creatorId' }, { status: 400 });

  const creators = await getCreatorsFromDb();
  const creator = creators.find(c => c.id === creatorId);
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 });

  if (managerId) {
    // Specific manager requested
    const manager = creators.find(c => c.id === managerId);
    if (!manager) return NextResponse.json({ error: 'Manager not found' }, { status: 404 });

    const assignment = await createAssignment(creatorId, managerId);
    await updateCreatorInDb({ ...creator, accountStatus: 'pending_manager' });

    // Notify manager
    if (manager.email) {
      await sendManagerAssignmentRequest(manager.email, manager.name, creator.handle, creator.name);
    }
    await pushNotification({
      recipientId: managerId,
      type: 'assignment_request',
      title: 'New Assignment Request',
      message: `${creator.name} (${creator.handle}) has requested you as their manager.`,
      link: '/portal/admin/assignments',
    });

    await sendAdminAlert(
      'New Creator Manager Request',
      `${creator.name} (${creator.handle}) requested ${manager.name} as their manager. Assignment ID: ${assignment.id}`
    );
  } else {
    // No manager — add to pool and broadcast
    await addToPool(creatorId);
    await updateCreatorInDb({ ...creator, accountStatus: 'in_pool' });

    const managers = await getManagers();
    await Promise.all(managers.map(m => {
      const mc = creators.find(c => c.id === m.id);
      return mc?.email
        ? sendCreatorPoolAlert(mc.email, mc.name, creator.handle)
        : Promise.resolve();
    }));

    await sendAdminAlert(
      'Creator Needs Manager',
      `${creator.name} (${creator.handle}) selected "No Manager" and has been added to the Available Creators pool.`
    );

    for (const m of managers) {
      await pushNotification({
        recipientId: m.id,
        type: 'pool_update',
        title: 'Creator Available',
        message: `${creator.handle} is in the pool and needs a manager.`,
        link: '/portal/admin/available-creators',
      });
    }
  }

  return NextResponse.json({ success: true });
}
