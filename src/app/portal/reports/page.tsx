import { getSession } from '@/app/actions/auth';
import { ReportsClient } from './ReportsClient';
import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Data Cards | PTA Portal' };

export default async function ReportsPage() {
  const session = await getSession();
  return <ReportsClient creator={session!} />;
}
