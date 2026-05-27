import { getSession } from '@/app/actions/auth';
import { redirect, notFound } from 'next/navigation';
import { PortalClient } from './PortalClient';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettingsFromDb } from '@/lib/creators-db';

export const metadata = {
  title: "Creator Portal | Peace Time Agency",
  description: "Manage your creator profile and showcase your content.",
};

export default async function CreatorPortalPage() {
  if (process.env.HIDE_ADMIN_PORTAL === "true") {
    notFound();
  }

  const session = await getSession();
  
  if (!session) {
    redirect('/creators');
  }

  const settings = await getSiteSettingsFromDb();

  return (
    <main className="flex min-h-screen flex-col bg-[#01020A]">
      <div className="flex-grow pt-8 pb-20">
        <PortalClient initialCreator={session} />
      </div>
      <Footer settings={settings.footer} />
    </main>
  );
}
