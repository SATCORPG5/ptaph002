'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'request' | 'sent' | 'reset' | 'done';

function ResetPasswordContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = sp.get('token');

  const [mode, setMode] = useState<Mode>(token ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await fetch('/api/auth/password-reset/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) setMode('sent');
    else { const d = await res.json(); setError(d.error || 'Request failed'); }
  }

  async function confirmReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError(null);
    const res = await fetch('/api/auth/password-reset/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) setMode('done');
    else { const d = await res.json(); setError(d.error || 'Reset failed'); }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01020A] to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0F1623] border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
          <div className="p-10">
            <AnimatePresence mode="wait">

              {mode === 'request' && (
                <motion.div key="request" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h1 className="text-3xl font-black uppercase italic mb-1">Reset Password</h1>
                  <p className="text-white/40 text-sm mb-8">Enter your email and we'll send a reset link valid for 30 minutes.</p>
                  <form onSubmit={requestReset} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1 block mb-1.5">Email Address</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} required />
                    </div>
                    {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/80 disabled:opacity-60 text-white font-black text-sm uppercase tracking-widest transition-all">
                      {loading ? '...' : 'Send Reset Link'}
                    </button>
                    <button type="button" onClick={() => router.push('/login')} className="w-full text-white/30 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">
                      Back to Login
                    </button>
                  </form>
                </motion.div>
              )}

              {mode === 'sent' && (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="inline-flex p-5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h2 className="text-2xl font-black uppercase italic mb-2">Check Your Email</h2>
                  <p className="text-white/40 text-sm mb-8">If that email is registered, a reset link has been sent. It expires in 30 minutes.</p>
                  <button onClick={() => router.push('/login')} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black text-sm uppercase tracking-widest transition-all">
                    Back to Login
                  </button>
                </motion.div>
              )}

              {mode === 'reset' && (
                <motion.div key="reset" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <h1 className="text-3xl font-black uppercase italic mb-1">New Password</h1>
                  <p className="text-white/40 text-sm mb-8">Choose a strong password (minimum 8 characters).</p>
                  <form onSubmit={confirmReset} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1 block mb-1.5">New Password</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1 block mb-1.5">Confirm Password</label>
                      <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" className={inputCls} required />
                    </div>
                    {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/80 disabled:opacity-60 text-white font-black text-sm uppercase tracking-widest transition-all">
                      {loading ? '...' : 'Set New Password'}
                    </button>
                  </form>
                </motion.div>
              )}

              {mode === 'done' && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="inline-flex p-5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h2 className="text-2xl font-black uppercase italic mb-2">Password Updated</h2>
                  <p className="text-white/40 text-sm mb-8">Your password has been reset. You can now log in with your new credentials.</p>
                  <button onClick={() => router.push('/login')} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black text-sm uppercase tracking-widest transition-all">
                    Sign In
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
        <p className="text-center text-xs text-white/20 font-bold uppercase tracking-widest mt-8">Peace Time Agency · Secure Reset</p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#01020A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
