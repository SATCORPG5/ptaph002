import { Metadata } from 'next';
import { LiveFloorClient } from './LiveFloorClient';

export const metadata: Metadata = { title: 'Live Floor | PTA Portal' };

export default function LiveFloorPage() {
  return <LiveFloorClient />;
}
