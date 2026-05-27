import { redis } from '@/lib/redis';
import { getCreatorsFromDb } from '@/lib/creators-db';
import { generateToken } from './index';

const ASSIGNMENT_PREFIX = 'pta:auth:assignment:';
const CREATOR_ASSIGNMENT_KEY = (creatorId: string) => `pta:auth:creator_assignment:${creatorId}`;
const POOL_KEY = 'pta:auth:creator_pool';
const NOTIFICATIONS_KEY = (userId: string) => `pta:auth:notifications:${userId}`;
const MESSAGES_KEY = (creatorId: string) => `pta:auth:onboarding_messages:${creatorId}`;

export type AssignmentStatus = 'pending' | 'accepted' | 'denied';

export interface ManagerAssignment {
  id: string;
  creatorId: string;
  managerId: string;
  status: AssignmentStatus;
  createdAt: number;
  respondedAt?: number;
  notes?: string;
}

export interface PortalNotification {
  id: string;
  recipientId: string;
  type: 'assignment_request' | 'assignment_accepted' | 'assignment_denied' | 'pool_update' | 'admin_alert';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

export interface OnboardingMessage {
  id: string;
  fromId: string;
  fromName: string;
  fromRole: 'creator' | 'manager' | 'admin';
  body: string;
  createdAt: number;
}

// ── Managers ────────────────────────────────────────────────────────

/** Returns all creators with tier 'recruiter' or 'staff' as selectable managers. */
export async function getManagers() {
  const creators = await getCreatorsFromDb();
  return creators
    .filter(c => c.tier === 'recruiter' || c.tier === 'staff')
    .map(c => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      image: c.image,
      role: c.tier as 'recruiter' | 'staff',
    }));
}

// ── Assignments ──────────────────────────────────────────────────────

export async function createAssignment(creatorId: string, managerId: string): Promise<ManagerAssignment> {
  const id = generateToken(12);
  const assignment: ManagerAssignment = {
    id,
    creatorId,
    managerId,
    status: 'pending',
    createdAt: Date.now(),
  };
  const TTL = 60 * 60 * 24 * 30;
  await redis.setex(`${ASSIGNMENT_PREFIX}${id}`, TTL, JSON.stringify(assignment));
  await redis.set(CREATOR_ASSIGNMENT_KEY(creatorId), id);
  return assignment;
}

export async function getAssignmentByCreator(creatorId: string): Promise<ManagerAssignment | null> {
  try {
    const id = await redis.get<string>(CREATOR_ASSIGNMENT_KEY(creatorId));
    if (!id) return null;
    const raw = await redis.get<string | ManagerAssignment>(`${ASSIGNMENT_PREFIX}${id}`);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

export async function getAssignmentById(id: string): Promise<ManagerAssignment | null> {
  try {
    const raw = await redis.get<string | ManagerAssignment>(`${ASSIGNMENT_PREFIX}${id}`);
    if (!raw) return null;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

export async function updateAssignmentStatus(
  id: string,
  status: AssignmentStatus,
  notes?: string
): Promise<ManagerAssignment | null> {
  const assignment = await getAssignmentById(id);
  if (!assignment) return null;
  const updated: ManagerAssignment = { ...assignment, status, respondedAt: Date.now(), notes };
  await redis.setex(`${ASSIGNMENT_PREFIX}${id}`, 60 * 60 * 24 * 30, JSON.stringify(updated));
  return updated;
}

// ── Available Creators Pool ──────────────────────────────────────────

export async function addToPool(creatorId: string) {
  const pool: string[] = (await redis.get<string[]>(POOL_KEY)) ?? [];
  if (!pool.includes(creatorId)) { pool.push(creatorId); await redis.set(POOL_KEY, pool); }
}

export async function removeFromPool(creatorId: string) {
  const pool: string[] = (await redis.get<string[]>(POOL_KEY)) ?? [];
  await redis.set(POOL_KEY, pool.filter(id => id !== creatorId));
}

export async function getPool(): Promise<string[]> {
  return (await redis.get<string[]>(POOL_KEY)) ?? [];
}

// ── Notifications ────────────────────────────────────────────────────

export async function pushNotification(n: Omit<PortalNotification, 'id' | 'createdAt' | 'read'>) {
  const key = NOTIFICATIONS_KEY(n.recipientId);
  const list: PortalNotification[] = (await redis.get<PortalNotification[]>(key)) ?? [];
  list.unshift({ ...n, id: generateToken(8), read: false, createdAt: Date.now() });
  await redis.set(key, list.slice(0, 50));
}

export async function getNotifications(userId: string): Promise<PortalNotification[]> {
  return (await redis.get<PortalNotification[]>(NOTIFICATIONS_KEY(userId))) ?? [];
}

export async function markRead(userId: string, notifId: string) {
  const key = NOTIFICATIONS_KEY(userId);
  const list: PortalNotification[] = (await redis.get<PortalNotification[]>(key)) ?? [];
  await redis.set(key, list.map(n => n.id === notifId ? { ...n, read: true } : n));
}

// ── Onboarding Messages ──────────────────────────────────────────────

export async function addOnboardingMessage(creatorId: string, msg: Omit<OnboardingMessage, 'id' | 'createdAt'>) {
  const key = MESSAGES_KEY(creatorId);
  const list: OnboardingMessage[] = (await redis.get<OnboardingMessage[]>(key)) ?? [];
  list.push({ ...msg, id: generateToken(8), createdAt: Date.now() });
  await redis.set(key, list.slice(-100));
}

export async function getOnboardingMessages(creatorId: string): Promise<OnboardingMessage[]> {
  return (await redis.get<OnboardingMessage[]>(MESSAGES_KEY(creatorId))) ?? [];
}
