import { getCreatorsFromDb, getSiteSettingsFromDb } from '@/lib/creators-db';
import { Footer } from '@/components/layout/Footer';
import CrmClient from '@/components/dashboard/CrmClient';
import { getSession } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Agency CRM | Peace Time Agency",
  description: "Manage your creator roster, track performance, and keep internal notes.",
};

export const dynamic = 'force-dynamic';

export default async function CrmPage() {
  const session = await getSession();

  // Only staff/founder can access CRM
  if (!session || (session.tier !== 'staff' && session.tier !== 'recruiter')) {
    redirect('/creators');
  }

  const creators = await getCreatorsFromDb();
  const settings = await getSiteSettingsFromDb();

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <CrmClient creators={creators} />
      <Footer settings={settings.footer} />
    </main>
  );
}
