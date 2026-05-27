import { Metadata } from 'next';
import { CollabLoungeClient } from './CollabLoungeClient';

export const metadata: Metadata = { title: 'Collab Lounge | PTA Portal' };

export default function CollabLoungePage() {
  return <CollabLoungeClient />;
}
