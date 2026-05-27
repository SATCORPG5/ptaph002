import { getSession } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { PortalShell } from '@/components/portal/PortalShell';

export const dynamic = 'force-dynamic';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <PortalShell creator={session}>
      {children}
    </PortalShell>
  );
}
