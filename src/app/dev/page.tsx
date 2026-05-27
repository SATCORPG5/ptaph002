'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Creator {
  id: string; name: string; handle: string; tier: string;
  accountStatus: string; onboardingCompleted: boolean;
  email: string; tiktokOpenId: string; twoFactorEnabled: boolean; passwordSet: boolean;
}

interface StateData {
  usingMockRedis: boolean;
  store: Record<string, string>;
  creators: Creator[];
}

const MOCK_CREATORS = [
  { label: 'Baked (Founder/Staff)', id: 'baked',              portal: '/portal/home',    badge: 'admin',   pw: 'SATCORPIT002' },
  { label: 'GeneralSpuds (Manager)', id: 'generalspuds',      portal: '/portal/home',    badge: 'manager', pw: 'SATCORPIT002' },
  { label: 'ColdP1zza (Creator)',    id: 'coldp1zza',         portal: '/creator-portal', badge: 'creator', pw: 'SATCORPIT002' },
  { label: 'TrashSoupGaming (Mgr)',  id: 'trashsoupgaming',   portal: '/portal/home',    badge: 'manager', pw: 'Test1234!' },
  { label: 'OopsItsJRPGTime',        id: 'oopsitsjrpgtime',   portal: '/creator-portal', badge: 'creator', pw: 'Test1234!' },
];

export default function DevPage() {
  const router = useRouter();
  const [state, setState] = useState<StateData | null>(null);
  const [log, setLog] = useState<{ time: string; msg: string; ok: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'store' | 'creators'>('overview');

  const addLog = (msg: string, ok = true) => {
    setLog(l => [{ time: new Date().toLocaleTimeString(), msg, ok }, ...l].slice(0, 30));
  };

  const loadState = useCallback(async () => {
    const res = await fetch('/api/dev?action=state');
    if (res.ok) setState(await res.json());
  }, []);

  useEffect(() => { loadState(); }, [loadState]);

  async function action(act: string, body?: object, label?: string) {
    setLoading(true);
    const res = await fetch(`/api/dev?action=${act}`, {
      method: body !== undefined ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    addLog(label || act, res.ok);
    if (!res.ok) addLog(`  ↳ ${data.error}`, false);
    else if (data.message) addLog(`  ↳ ${data.message}`, true);
    await loadState();
    setLoading(false);
    return { ok: res.ok, data };
  }

  async function quickLogin(creatorId: string, portal = '/portal/home') {
    const { ok, data } = await action('login', { creatorId }, `Login as ${creatorId}`);
    if (ok) {
      addLog(`  ↳ Session: ${data.sessionId?.slice(0, 16)}...`);
      router.push(portal);
    }
  }

  const storeKeys = state ? Object.keys(state.store) : [];
  const authKeys = storeKeys.filter(k => k.startsWith('pta:auth:'));
  const allowlistSeeded = storeKeys.some(k => k === 'pta:auth:allowlist:ids');

  return (
    <div className="min-h-screen bg-[#01020A] text-white font-mono p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-bold uppercase tracking-widest">Dev Mode</span>
            {state && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${state.usingMockRedis ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {state.usingMockRedis ? 'In-Memory Redis' : 'Real Redis'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Auth Test Dashboard</h1>
          <p className="text-white/30 text-xs mt-1">PTA Portal · Development Environment · localhost:3000</p>
        </div>
        <button onClick={loadState} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs hover:bg-white/10 transition-all">
          ↺ Refresh
        </button>
      </div>

      {/* Status banner */}
      {state && !allowlistSeeded && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm">⚠</span>
            <span className="text-red-400 text-xs font-bold">Allowlist not seeded — TikTok login will deny everyone</span>
          </div>
          <button onClick={() => action('seed', {}, 'Seed all mock data')} className="px-3 py-1 bg-red-500 rounded-lg text-white text-xs font-black hover:bg-red-600 transition-all">
            Seed Now
          </button>
        </div>
      )}
      {state && allowlistSeeded && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-2">
          <span className="text-green-400 text-sm">✓</span>
          <span className="text-green-400 text-xs font-bold">Allowlist seeded · {storeKeys.length} Redis keys in memory</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left col: actions */}
        <div className="space-y-4">

          {/* Seed / Reset */}
          <Card title="Environment">
            <Btn onClick={() => action('seed', {}, 'Seed all mock data')} loading={loading} color="primary">
              Seed All Mock Data
            </Btn>
            <Btn onClick={() => action('reset', {}, 'Reset Redis store')} loading={loading} color="red">
              Reset Redis Store
            </Btn>
            <p className="text-white/30 text-[10px] mt-2">
              Seed patches all creators with mock emails + allowlist entries.<br />
              <span className="text-yellow-400/70">baked · generalspuds · coldp1zza</span> → <code className="bg-white/10 px-1 rounded">SATCORPIT002</code><br />
              All others → <code className="bg-white/10 px-1 rounded">Test1234!</code>
            </p>
          </Card>

          {/* Quick Login */}
          <Card title="Quick Login (bypasses password/2FA)">
            <div className="space-y-1.5">
              {MOCK_CREATORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => quickLogin(c.id, c.portal)}
                  disabled={loading}
                  className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 rounded-lg text-xs transition-all disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{c.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-white/30">{c.pw}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        c.badge === 'admin'   ? 'bg-red-500/20 text-red-400' :
                        c.badge === 'manager' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-white/10 text-white/40'
                      }`}>{c.badge}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-white/25 mt-0.5 block">→ {c.portal}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Manual Allowlist */}
          <Card title="Add to Allowlist">
            <AllowlistForm onSubmit={async (id, un) => {
              await action('allow', { tiktokOpenId: id, username: un }, `Allow ${id}`);
            }} loading={loading} />
          </Card>

          {/* Auth flow links */}
          <Card title="Test Pages">
            {[
              { label: 'Login Page',             href: '/login',                          note: 'all accounts' },
              { label: 'Admin Portal',            href: '/admin',                          note: 'PIN: SATCORPIT002' },
              { label: 'Manager Portal',          href: '/portal/home',                    note: 'generalspuds' },
              { label: 'Creator Portal',          href: '/creator-portal',                 note: 'coldp1zza' },
              { label: 'TikTok Login (mock)',     href: '/api/auth/tiktok/login',          note: 'mock flow' },
              { label: 'Onboarding',              href: '/onboarding',                     note: '' },
              { label: 'Reset Password',          href: '/reset-password',                 note: '' },
              { label: 'Verify Email',            href: '/verify-email?token=mock',        note: '' },
              { label: '2FA Page',                href: '/login/2fa?creator_id=baked',     note: '' },
            ].map(l => (
              <a key={l.href} href={l.href} className="block px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-all mb-1">
                <div className="flex items-center justify-between">
                  <span>→ {l.label}</span>
                  {l.note && <span className="text-[9px] text-white/25">{l.note}</span>}
                </div>
                <span className="text-[9px] text-white/20">{l.href}</span>
              </a>
            ))}
          </Card>
        </div>

        {/* Right col: state + log */}
        <div className="lg:col-span-2 space-y-4">

          {/* Tabs */}
          <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
            {(['overview', 'store', 'creators'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-primary text-white' : 'text-white/40 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Redis Keys" value={storeKeys.length} />
                <StatCard label="Auth Keys" value={authKeys.length} />
                <StatCard label="Creators" value={state?.creators.length ?? 0} />
              </div>
              <Card title="Auth Keys in Store">
                {authKeys.length === 0
                  ? <p className="text-white/30 text-xs">None — run Seed first</p>
                  : authKeys.map(k => (
                    <div key={k} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                      <span className="text-xs text-primary/80 truncate max-w-[70%]">{k}</span>
                      <span className="text-[10px] text-white/30 truncate max-w-[25%]">
                        {state!.store[k].slice(0, 30)}{state!.store[k].length > 30 ? '…' : ''}
                      </span>
                    </div>
                  ))}
              </Card>
            </div>
          )}

          {activeTab === 'store' && (
            <Card title={`Redis Store (${storeKeys.length} keys)`}>
              <div className="overflow-auto max-h-96">
                {storeKeys.length === 0
                  ? <p className="text-white/30 text-xs">Store is empty</p>
                  : storeKeys.map(k => (
                    <div key={k} className="mb-2">
                      <div className="text-[10px] text-primary font-bold">{k}</div>
                      <pre className="text-[9px] text-white/50 whitespace-pre-wrap break-all bg-black/30 rounded p-1 mt-0.5">
                        {formatValue(state!.store[k])}
                      </pre>
                    </div>
                  ))}
              </div>
            </Card>
          )}

          {activeTab === 'creators' && (
            <Card title={`Creators (${state?.creators.length ?? 0})`}>
              <div className="overflow-auto max-h-96 space-y-2">
                {state?.creators.map(c => (
                  <div key={c.id} className="p-3 bg-black/30 rounded-xl border border-white/5">
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="text-sm font-black text-white">{c.name}</span>
                        <span className="text-xs text-primary ml-2">{c.handle}</span>
                      </div>
                      <div className="flex gap-1">
                        <Badge value={c.tier} />
                        <Badge value={c.accountStatus || 'no-status'} color={c.accountStatus === 'active' ? 'green' : 'yellow'} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 text-[10px] text-white/40">
                      <div>Email: <span className="text-white/60">{c.email || 'none'}</span></div>
                      <div>TikTok ID: <span className="text-white/60">{c.tiktokOpenId?.slice(0, 20) || 'none'}</span></div>
                      <div>Password: <span className={c.passwordSet ? 'text-green-400' : 'text-red-400'}>{c.passwordSet ? 'set (scrypt)' : 'not set'}</span></div>
                      <div>2FA: <span className={c.twoFactorEnabled ? 'text-yellow-400' : 'text-white/40'}>{c.twoFactorEnabled ? 'on' : 'off'}</span></div>
                      <div>Onboarded: <span className={c.onboardingCompleted ? 'text-green-400' : 'text-red-400'}>{String(c.onboardingCompleted)}</span></div>
                    </div>
                    <button onClick={() => {
                      const known = MOCK_CREATORS.find(m => m.id === c.id);
                      quickLogin(c.id, known?.portal ?? '/portal/home');
                    }} className="mt-2 px-2 py-1 bg-primary/20 hover:bg-primary/40 border border-primary/30 rounded text-[10px] text-primary font-bold transition-all">
                      Quick Login →
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Activity Log */}
          <Card title="Activity Log">
            <div className="max-h-48 overflow-y-auto space-y-1">
              {log.length === 0 ? (
                <p className="text-white/30 text-xs">No activity yet</p>
              ) : log.map((l, i) => (
                <div key={i} className="flex gap-2 text-[10px]">
                  <span className="text-white/20 flex-shrink-0">{l.time}</span>
                  <span className={l.ok ? 'text-green-400' : 'text-red-400'}>{l.msg}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0F1623] border border-white/10 rounded-xl p-4">
      <p className="text-[10px] font-black text-primary/60 tracking-[0.2em] uppercase mb-3">{title}</p>
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#0F1623] border border-white/10 rounded-xl p-3 text-center">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Btn({ onClick, loading, color, children }: { onClick: () => void; loading: boolean; color?: string; children: React.ReactNode }) {
  const colors: Record<string, string> = {
    primary: 'bg-primary/20 border-primary/30 text-primary hover:bg-primary/30',
    red: 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30',
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full px-3 py-2 rounded-lg border text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 mb-2 ${colors[color || 'primary']}`}
    >
      {children}
    </button>
  );
}

function Badge({ value, color = 'default' }: { value: string; color?: string }) {
  const colors: Record<string, string> = {
    default: 'bg-white/10 text-white/50',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${colors[color]}`}>{value}</span>
  );
}

function AllowlistForm({ onSubmit, loading }: { onSubmit: (id: string, un: string) => void; loading: boolean }) {
  const [id, setId] = useState('');
  const [un, setUn] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); if (id) { onSubmit(id, un); setId(''); setUn(''); } }} className="space-y-2">
      <input value={id} onChange={e => setId(e.target.value)} placeholder="TikTok open_id" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50" />
      <input value={un} onChange={e => setUn(e.target.value)} placeholder="username (optional)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50" />
      <button type="submit" disabled={loading || !id} className="w-full py-1.5 bg-primary/20 border border-primary/30 text-primary text-xs font-black rounded-lg hover:bg-primary/30 transition-all disabled:opacity-50">
        Add to Allowlist
      </button>
    </form>
  );
}

function formatValue(v: string): string {
  try { return JSON.stringify(JSON.parse(v), null, 2); } catch { return v; }
}
