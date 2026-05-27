import { getSession } from '@/app/actions/auth';
import { getCreatorsFromDb } from '@/lib/creators-db';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { MyTeamClient } from './MyTeamClient';

export const metadata: Metadata = { title: 'My Team | PTA Portal' };

export default async function MyTeamPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const tier = session.tier;
  const isManager = tier === 'recruiter';
  const isAdmin = tier === 'staff';
  const isCreatorWithManager = !!session.managerId;

  // Only managers, admins, and creators assigned to a manager can access
  if (!isManager && !isAdmin && !isCreatorWithManager) {
    redirect('/portal/home');
  }

  const allCreators = await getCreatorsFromDb();

  // Determine which manager's team to show
  let managerId: string | null = null;
  if (isManager) {
    managerId = session.id;
  } else if (isCreatorWithManager) {
    managerId = session.managerId!;
  }
  // Admin: managerId stays null (they pick via UI)

  const manager = managerId ? allCreators.find(c => c.id === managerId) || null : null;
  const teamCreators = managerId ? allCreators.filter(c => c.managerId === managerId) : [];
  const allManagers = allCreators.filter(c => c.tier === 'recruiter');

  return (
    <MyTeamClient
      viewer={session}
      manager={manager}
      teamCreators={teamCreators}
      allManagers={allManagers}
      isAdmin={isAdmin}
      isManager={isManager}
    />
  );
}
