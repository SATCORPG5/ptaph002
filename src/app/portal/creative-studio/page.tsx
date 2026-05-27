import { Metadata } from 'next';
import { CreativeStudioClient } from './CreativeStudioClient';

export const metadata: Metadata = { title: 'Creative Studio | PTA Portal' };

export default function CreativeStudioPage() {
  return <CreativeStudioClient />;
}
