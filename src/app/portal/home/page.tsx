import { getSession } from '@/app/actions/auth';
import { LobbyClient } from './LobbyClient';

export const metadata = { title: 'Lobby | PTA Portal' };

export default async function LobbyPage() {
  const session = await getSession();
  return <LobbyClient creator={session!} />;
}
