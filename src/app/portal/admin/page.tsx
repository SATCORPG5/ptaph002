import { getSession } from '@/app/actions/auth';
import { PortalAdminClient } from './PortalAdminClient';
import { getCreatorsFromDb } from '@/lib/creators-db';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Controls | PTA Portal' };

export default async function PortalAdminPage() {
  const session = await getSession();
  const role = (session as any)?.role || 'creator';

  // Only admin/staff can see this
  if (role !== 'admin' && role !== 'staff' && session?.tier !== 'staff') {
    redirect('/portal/home');
  }

  const creators = await getCreatorsFromDb();
  return <PortalAdminClient manager={session!} creators={creators} />;
}
