import { getSession } from '@/app/actions/auth';
import { MyCreatorsClient } from './MyCreatorsClient';
import { getCreatorsFromDb } from '@/lib/creators-db';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Creators | PTA Portal' };

export default async function MyCreatorsPage() {
  const session = await getSession();
  const creators = await getCreatorsFromDb();
  return <MyCreatorsClient manager={session!} creators={creators} />;
}
