'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Manager { id: string; name: string; handle: string; image: string; role: string; }
interface TikTokProfile { open_id: string; display_name: string; username: string; avatar_url: string; follower_count?: number; }
interface OnboardingMessage { id: string; fromName: string; fromRole: string; body: string; createdAt: number; }

type Step = 'profile' | 'security' | 'manager' | 'pending';

interface Props {
  tiktokProfile?: TikTokProfile;
  creatorId?: string;
  isPending?: boolean;
}

const STEPS: Step[] = ['profile', 'security', 'manager', 'pending'];

export default function OnboardingFlow({ tiktokProfile, creatorId: initialCreatorId, isPending }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(isPending ? 'pending' : 'profile');
  const [creatorId, setCreatorId] = useState(initialCreatorId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [messages, setMessages] = useState<OnboardingMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Profile fields
  const [displayName, setDisplayName] = useState(tiktokProfile?.display_name || '');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');

  // Security fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [enable2FA, setEnable2FA] = useState(false);

  // Manager fields
  const [selectedManager, setSelectedManager] = useState('');
  const [noManager, setNoManager] = useState(false);

  useEffect(() => {
    fetch('/api/managers').then(r => r.json()).then(d => setManagers(d.managers || []));
  }, []);

  useEffect(() => {
    if (step === 'pending' && creatorId) {
      loadMessages();
      const interval = setInterval(loadMessages, 8000);
      return () => clearInterval(interval);
    }
  }, [step, creatorId]);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function loadMessages() {
    if (!creatorId) return;
    const res = await fetch(`/api/onboarding/messages?creatorId=${creatorId}`);
    if (res.ok) { const d = await res.json(); setMessages(d.messages || []); }
  }

  async function submitProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError('Email is required.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/onboarding/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tiktokOpenId: tiktokProfile?.open_id,
          displayName,
          handle: tiktokProfile?.username ? `@${tiktokProfile.username}` : undefined,
          bio,
          email,
          avatarUrl: tiktokProfile?.avatar_url,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error); return; }
      setCreatorId(d.creatorId);
      setStep('security');
    } finally { setLoading(false); }
  }

  async function submitSecurity(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (!recoveryEmail) { setError('Recovery email is required.'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/onboarding/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, password, recoveryEmail, enable2FA }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error); return; }
      setStep('manager');
    } finally { setLoading(false); }
  }

  async function submitManager(e: React.FormEvent) {
    e.preventDefault();
    if (!noManager && !selectedManager) { setError('Please select a manager or choose "No Manager".'); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/onboarding/manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, managerId: noManager ? null : selectedManager }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error); return; }
      setStep('pending');
    } finally { setLoading(false); }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await fetch('/api/onboarding/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId, body: newMessage.trim() }),
    });
    setNewMessage('');
    loadMessages();
  }

  const stepIndex = STEPS.indexOf(step);
  const stepLabels = ['Profile', 'Security', 'Manager', 'Pending'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01020A] via-[#0a0d15] to-black text-white flex items-start justify-center pt-10 pb-20 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[10px] font-black text-primary/60 tracking-[0.3em] uppercase mb-2">Creator Portal</p>
          <h1 className="text-4xl font-black uppercase italic tracking-tight">
            {step === 'pending' ? 'Almost There' : 'Welcome Aboard'}
          </h1>
          <p className="text-white/40 text-sm mt-2">
            {step === 'pending'
              ? 'Your request is under review. Hang tight!'
              : 'Set up your creator account to access the portal.'}
          </p>
        </div>

        {/* Step Progress */}
        {step !== 'pending' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['Profile', 'Security', 'Manager'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                  i < stepIndex ? 'bg-primary border-primary text-white' :
                  i === stepIndex ? 'border-primary text-primary' :
                  'border-white/20 text-white/30'
                }`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${
                  i === stepIndex ? 'text-primary' : 'text-white/30'
                }`}>{label}</span>
                {i < 2 && <div className={`w-8 h-px ${i < stepIndex ? 'bg-primary' : 'bg-white/20'}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 1: Profile ─────────────────────────────────────── */}
          {step === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-[#0F1623] border border-white/10 rounded-[2rem] p-8">
                {tiktokProfile && (
                  <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl mb-6">
                    {tiktokProfile.avatar_url && (
                      <img src={tiktokProfile.avatar_url} alt="TikTok avatar" className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
                    )}
                    <div>
                      <p className="font-black text-white">{tiktokProfile.display_name}</p>
                      <p className="text-xs text-primary font-bold">@{tiktokProfile.username}</p>
                      <p className="text-[10px] text-white/40 mt-1">Connected via TikTok · info auto-filled below</p>
                    </div>
                  </div>
                )}

                <form onSubmit={submitProfile} className="space-y-5">
                  <Field label="Display Name" note="Visible on your creator card">
                    <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your display name" className={inputCls} required />
                  </Field>

                  {tiktokProfile?.username && (
                    <Field label="TikTok Handle" note="From your TikTok account (not editable)">
                      <input type="text" value={`@${tiktokProfile.username}`} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
                    </Field>
                  )}

                  <Field label="Email" note="Used for verification and portal notifications">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} required />
                  </Field>

                  <Field label="Bio" note="Short intro shown on your profile">
                    <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself and your content..." rows={3} className={`${inputCls} resize-none`} />
                  </Field>

                  {error && <ErrorBanner msg={error} />}
                  <SubmitBtn loading={loading} label="Save Profile" />
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Security ─────────────────────────────────────── */}
          {step === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-[#0F1623] border border-white/10 rounded-[2rem] p-8">
                <p className="text-white/40 text-sm mb-6">Set your unique password and recovery email. You'll use these to log in without TikTok.</p>
                <form onSubmit={submitSecurity} className="space-y-5">
                  <Field label="Password" note="Min 8 characters">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
                  </Field>
                  <Field label="Confirm Password">
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
                  </Field>
                  <Field label="Recovery Email" note="Used for password resets (can be the same as above)">
                    <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} placeholder="backup@example.com" className={inputCls} required />
                  </Field>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setEnable2FA(!enable2FA)}
                      className={`w-12 h-6 rounded-full border-2 transition-all relative flex-shrink-0 ${enable2FA ? 'bg-primary border-primary' : 'bg-white/10 border-white/20'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${enable2FA ? 'left-6' : 'left-0.5'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">Enable Two-Factor Authentication</p>
                      <p className="text-[10px] text-white/40">A code will be emailed to you on each login</p>
                    </div>
                  </label>

                  {error && <ErrorBanner msg={error} />}
                  <SubmitBtn loading={loading} label="Set Security" />
                  <BackBtn onClick={() => setStep('profile')} />
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Manager ──────────────────────────────────────── */}
          {step === 'manager' && (
            <motion.div key="manager" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-[#0F1623] border border-white/10 rounded-[2rem] p-8">
                <p className="text-white/40 text-sm mb-6">
                  Select your assigned manager. Your request will be sent to them for approval. If they can't take you on, an admin will step in.
                </p>
                <form onSubmit={submitManager} className="space-y-4">
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {managers.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setSelectedManager(m.id); setNoManager(false); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          selectedManager === m.id && !noManager
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        {m.image && <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover" />}
                        <div>
                          <p className="font-black text-white text-sm">{m.name}</p>
                          <p className="text-[10px] text-white/40">{m.handle} · {m.role}</p>
                        </div>
                        {selectedManager === m.id && !noManager && (
                          <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Or</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <button
                    type="button"
                    onClick={() => { setNoManager(true); setSelectedManager(''); }}
                    className={`w-full p-3 rounded-xl border transition-all text-left ${
                      noManager ? 'border-yellow-500/60 bg-yellow-500/10' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <p className="font-black text-white text-sm">No Manager Assigned Yet</p>
                    <p className="text-[10px] text-white/40">All managers and admins will be notified to pick you up</p>
                  </button>

                  {error && <ErrorBanner msg={error} />}
                  <SubmitBtn loading={loading} label="Submit Request" />
                  <BackBtn onClick={() => setStep('security')} />
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Pending ──────────────────────────────────────── */}
          {step === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="bg-[#0F1623] border border-white/10 rounded-[2rem] overflow-hidden">
                {/* Status banner */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                    <p className="text-[10px] font-black text-yellow-500 tracking-[0.2em] uppercase">Pending Approval</p>
                  </div>
                  <h2 className="text-xl font-black text-white">Your request has been submitted.</h2>
                  <p className="text-white/40 text-sm mt-1">
                    Your selected manager has been notified and must accept before you gain portal access. This page will update automatically.
                  </p>
                </div>

                {/* Profile preview */}
                {tiktokProfile && (
                  <div className="px-6 py-4 border-b border-white/10">
                    <p className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-3">Your Submitted Info</p>
                    <div className="flex items-center gap-3">
                      {tiktokProfile.avatar_url && <img src={tiktokProfile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover border border-white/10" />}
                      <div>
                        <p className="font-black text-white">{tiktokProfile.display_name}</p>
                        <p className="text-xs text-primary">@{tiktokProfile.username}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message panel */}
                <div className="p-6">
                  <p className="text-[10px] font-black text-white/30 tracking-widest uppercase mb-3">Messages</p>
                  <div className="bg-black/30 rounded-xl border border-white/10 h-52 overflow-y-auto p-3 space-y-2 mb-3">
                    {messages.length === 0 ? (
                      <p className="text-white/20 text-xs text-center py-8">No messages yet. Your manager or an admin may reach out here.</p>
                    ) : messages.map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.fromRole === 'creator' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                          msg.fromRole === 'creator' ? 'bg-primary/20 border border-primary/30 text-white' : 'bg-white/5 border border-white/10 text-white/80'
                        }`}>
                          {msg.fromRole !== 'creator' && <p className="text-[10px] font-black text-primary/60 mb-1">{msg.fromName} · {msg.fromRole}</p>}
                          {msg.body}
                        </div>
                      </div>
                    ))}
                    <div ref={msgEndRef} />
                  </div>
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Message your manager or admin..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button type="submit" className="px-4 py-2 bg-primary rounded-xl text-white text-sm font-black hover:bg-primary/80 transition-all">
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────

const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium text-sm";

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">{label}</label>
      {children}
      {note && <p className="text-[10px] text-white/30 ml-1">{note}</p>}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] font-bold text-center uppercase tracking-wider">{msg}</div>;
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/80 disabled:opacity-60 text-white font-black text-sm uppercase tracking-[0.15em] transition-all">
      {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : label}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full h-10 text-white/30 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
      Go Back
    </button>
  );
}
