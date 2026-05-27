import { redis } from '@/lib/redis';
import OnboardingFlow from '@/components/auth/OnboardingFlow';

interface PageProps {
  searchParams: Promise<{ tiktok_id?: string; creator_id?: string; pending?: string }>;
}

export default async function OnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { tiktok_id, creator_id, pending } = params;

  let tiktokProfile;
  if (tiktok_id) {
    const raw = await redis.get<string>(`pta:auth:tiktok_pending:${tiktok_id}`);
    if (raw) {
      try { tiktokProfile = (typeof raw === 'string' ? JSON.parse(raw) : raw).profile; } catch {}
    }
  }

  return (
    <OnboardingFlow
      tiktokProfile={tiktokProfile}
      creatorId={creator_id}
      isPending={!!pending}
    />
  );
}
