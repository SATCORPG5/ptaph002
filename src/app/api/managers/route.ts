import { NextRequest, NextResponse } from 'next/server';
import { getManagers } from '@/lib/auth/managers';

export async function GET(_req: NextRequest) {
  const managers = await getManagers();
  return NextResponse.json({ managers });
}
