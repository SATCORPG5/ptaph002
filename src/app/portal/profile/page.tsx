import { getSession } from '@/app/actions/auth';
import { ProfilePortalClient } from './ProfilePortalClient';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Profile | PTA Portal' };

export default async function ProfilePage() {
  const session = await getSession();
  return <ProfilePortalClient creator={session!} />;
}
