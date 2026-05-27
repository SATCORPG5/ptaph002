import { Metadata } from 'next';
import { AgencyOpsClient } from './AgencyOpsClient';

export const metadata: Metadata = { title: 'Agency Ops | PTA Portal' };

export default function AgencyOpsPage() {
  return <AgencyOpsClient />;
}
