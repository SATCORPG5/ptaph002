import { Metadata } from 'next';
import { GrowthAcademyClient } from './GrowthAcademyClient';

export const metadata: Metadata = { title: 'Growth Academy | PTA Portal' };

export default function GrowthAcademyPage() {
  return <GrowthAcademyClient />;
}
