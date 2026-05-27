-- ================================================================
-- Migration: 00001_auth_system.sql
-- Extends the PTA portal with a full auth and onboarding schema.
-- Run after 00000_init.sql
-- ================================================================

-- ── New ENUM types ──────────────────────────────────────────────
CREATE TYPE account_status AS ENUM (
  'active',
  'pending_onboarding',
  'pending_manager',
  'in_pool',
  'suspended'
);

CREATE TYPE assignment_status AS ENUM ('pending', 'accepted', 'denied');
CREATE TYPE notification_type AS ENUM (
  'assignment_request',
  'assignment_accepted',
  'assignment_denied',
  'pool_update',
  'admin_alert'
);
CREATE TYPE message_role AS ENUM ('creator', 'manager', 'admin');
CREATE TYPE token_type AS ENUM ('email_verify', 'password_reset', '2fa', 'tiktok_state');

-- ── Extend users table ──────────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS tiktok_open_id     TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS recovery_email     TEXT,
  ADD COLUMN IF NOT EXISTS email_verified     BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS account_status    account_status DEFAULT 'pending_onboarding',
  ADD COLUMN IF NOT EXISTS manager_id        UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- ── TikTok creator allowlist ─────────────────────────────────────
-- Primary auth gate: admins add tiktok_open_id values here
CREATE TABLE IF NOT EXISTS public.creator_allowlist (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tiktok_open_id  TEXT UNIQUE,
  tiktok_username TEXT,
  notes           TEXT,
  added_by        UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Manager assignments ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.manager_assignments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id  UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  manager_id  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status      assignment_status DEFAULT 'pending',
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_assignments_creator ON public.manager_assignments (creator_id);
CREATE INDEX IF NOT EXISTS idx_assignments_manager ON public.manager_assignments (manager_id);

-- ── Available creators pool ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.available_creators_pool (
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  added_at   TIMESTAMPTZ DEFAULT now()
);

-- ── Auth tokens (email verify, password reset, 2FA) ─────────────
CREATE TABLE IF NOT EXISTS public.auth_tokens (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token      TEXT UNIQUE NOT NULL,
  type       token_type NOT NULL,
  user_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email      TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON public.auth_tokens (token);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user  ON public.auth_tokens (user_id);

-- ── Sessions table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sessions (
  id          TEXT PRIMARY KEY,
  user_id     UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  ip_address  INET,
  user_agent  TEXT,
  two_factor_verified BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMPTZ DEFAULT now(),
  created_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.sessions (user_id);

-- ── Onboarding messages ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.onboarding_messages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id  UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  from_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  from_name   TEXT NOT NULL,
  from_role   message_role NOT NULL DEFAULT 'creator',
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_msgs_creator ON public.onboarding_messages (creator_id);

-- ── Portal notifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type         notification_type NOT NULL,
  title        TEXT NOT NULL,
  message      TEXT NOT NULL,
  link         TEXT,
  read         BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications (recipient_id);

-- ── Audit log ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  target_id  UUID,
  target_type TEXT,
  metadata   JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.audit_log (actor_id);

-- ── RLS Policies ────────────────────────────────────────────────

ALTER TABLE public.creator_allowlist     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manager_assignments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_creators_pool ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_tokens           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log             ENABLE ROW LEVEL SECURITY;

-- Allowlist: admins only
CREATE POLICY "Admins manage allowlist" ON public.creator_allowlist FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Assignments: creator sees own, manager sees their assignments, admin sees all
CREATE POLICY "Creators view own assignment" ON public.manager_assignments FOR SELECT USING (creator_id = auth.uid());
CREATE POLICY "Managers view their assignments" ON public.manager_assignments FOR SELECT USING (manager_id = auth.uid());
CREATE POLICY "Managers update their assignments" ON public.manager_assignments FOR UPDATE USING (manager_id = auth.uid());
CREATE POLICY "Admins full access to assignments" ON public.manager_assignments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Pool: managers and admins
CREATE POLICY "Managers view pool" ON public.available_creators_pool FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Auth tokens: user sees own
CREATE POLICY "Users see own tokens" ON public.auth_tokens FOR SELECT USING (user_id = auth.uid());

-- Sessions: user manages own
CREATE POLICY "Users see own sessions" ON public.sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users delete own sessions" ON public.sessions FOR DELETE USING (user_id = auth.uid());

-- Onboarding messages: creator + manager + admins
CREATE POLICY "Creator views own messages" ON public.onboarding_messages FOR SELECT USING (creator_id = auth.uid());
CREATE POLICY "Creator sends own messages" ON public.onboarding_messages FOR INSERT WITH CHECK (creator_id = auth.uid());
CREATE POLICY "Admins full access to messages" ON public.onboarding_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Notifications: recipient sees own
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT USING (recipient_id = auth.uid());
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (recipient_id = auth.uid());
CREATE POLICY "Admins full access to notifications" ON public.notifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Audit log: admins only
CREATE POLICY "Admins view audit log" ON public.audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
