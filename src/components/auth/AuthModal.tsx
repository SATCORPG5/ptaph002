'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  signInAction,
  requestVerificationAction,
  verifyIdentityAction,
  resetPasswordAction,
} from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'main' | 'signin' | 'identify' | 'verify' | 'setup' | 'success';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('main');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const resetState = () => {
    setMode('main'); setHandle(''); setPassword('');
    setConfirmPassword(''); setCode(''); setError(null);
  };

  const handleClose = () => { onClose(); setTimeout(resetState, 300); };

  const handleTikTokLogin = () => { router.push('/api/auth/tiktok/login'); onClose(); };

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    let result: Awaited<ReturnType<typeof signInAction>>;
    try {
      result = await signInAction(handle, password);
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
      return;
    }
    setLoading(false);

    if (result.success) {
      router.refresh();
      onClose();
      router.push('/portal/home');
    } else if ((result as any).requires2FA) {
      router.push(`/login/2fa?creator_id=${(result as any).creatorId}`);
      onClose();
    } else if ((result as any).needsOnboarding) {
      router.push(`/onboarding?creator_id=${(result as any).creatorId}`);
      onClose();
    } else if ((result as any).pendingApproval) {
      router.push(`/onboarding?creator_id=${(result as any).creatorId}&pending=1`);
      onClose();
    } else {
      setError(result.error || 'Failed to sign in');
    }
  }

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const result = await requestVerificationAction(handle);
      setLoading(false);
      if (result.success) setMode('verify');
      else setError(result.error || 'Failed to find creator');
    } catch {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const result = await verifyIdentityAction(handle, code);
      setLoading(false);
      if (result.success) setMode('setup');
      else setError(result.error || 'Invalid verification code');
    } catch {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 4) { setError('Password must be at least 4 characters'); return; }
    setLoading(true); setError(null);
    try {
      const result = await resetPasswordAction(handle, code, password);
      setLoading(false);
      if (result.success) setMode('success');
      else setError(result.error || 'Failed to update password');
    } catch {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="fixed inset-0 z-[100000] p-4 flex items-start justify-center pt-32 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
      <div
        className="relative w-full max-w-md bg-[#0F1623] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-10 duration-500 z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <button onClick={handleClose} className="absolute top-6 right-6 p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <div className="p-10 pt-14">
          <AnimatePresence mode="wait">

            {mode === 'main' && (
              <motion.div key="main" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Creator Login</h2>
                </div>
                <button onClick={handleTikTokLogin} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF1A43] hover:bg-[#D90026] px-6 py-4 text-sm font-black uppercase tracking-widest text-white transition-all mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.79a4.85 4.85 0 01-1.07-.1z" />
                  </svg>
                  Sign In with TikTok
                </button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-[#0F1623] px-4 text-white/30 font-bold uppercase tracking-widest">Or</span>
                  </div>
                </div>
                <button onClick={() => setMode('signin')} className="w-full rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 px-6 py-4 text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">
                  Email / Password
                </button>
              </motion.div>
            )}

            {mode === 'signin' && (
              <motion.div key="signin" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="text-center mb-10">
                  <div className="inline-block p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-6 cursor-pointer" onClick={() => setMode('main')}>
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Creator Access</h2>
                  <p className="text-white/40 text-sm">Log in with your email or TikTok handle.</p>
                </div>
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">Email or TikTok Handle</label>
                    <input type="text" placeholder="@handle or email@example.com" value={handle} onChange={e => setHandle(e.target.value)} className={inputCls} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">Password</label>
                    <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className={`${inputCls} tracking-widest`} required />
                    <div className="flex justify-between px-1">
                      <button type="button" onClick={() => setMode('identify')} className="text-[9px] font-black text-white/30 hover:text-primary uppercase tracking-wider transition-colors">
                        Set / Reset Password
                      </button>
                      <button type="button" onClick={() => { handleClose(); setTimeout(() => router.push('/reset-password'), 300); }} className="text-[9px] font-black text-white/30 hover:text-primary uppercase tracking-wider transition-colors">
                        Forgot Password?
                      </button>
                    </div>
                  </div>
                  {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold text-center uppercase tracking-wider">{error}</div>}
                  <div className="space-y-3">
                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-dark rounded-2xl font-black text-sm uppercase tracking-[0.1em] h-14" disabled={loading}>
                      {loading ? 'Verifying...' : 'Authorize Entry'}
                    </Button>
                    <button type="button" onClick={() => setMode('main')} className="w-full h-12 rounded-2xl font-bold text-xs text-white/20 hover:text-white/40 uppercase tracking-widest transition-all">
                      Go Back
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {mode === 'identify' && (
              <motion.div key="identify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Verification</h2>
                  <p className="text-white/40 text-sm">Enter your TikTok handle to verify your account.</p>
                </div>
                <form onSubmit={handleIdentify} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">TikTok Handle</label>
                    <input type="text" placeholder="@username" value={handle} onChange={e => setHandle(e.target.value)} className={inputCls} required />
                  </div>
                  {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold text-center">{error}</div>}
                  <Button type="submit" size="lg" className="w-full bg-primary h-14 rounded-2xl font-black" disabled={loading}>
                    {loading ? 'Verifying...' : 'Send Code'}
                  </Button>
                  <div className="flex flex-col gap-3 mt-2">
                    <button type="button" onClick={() => setMode('signin')} className="text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Back to Sign In</button>
                    <button type="button" onClick={handleClose} className="text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {mode === 'verify' && (
              <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Identity Check</h2>
                  <p className="text-white/40 text-sm">Enter the 6-digit code sent to your email or TikTok DM.</p>
                </div>
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">Verification Code</label>
                    <input type="text" placeholder="000000" maxLength={6} value={code} onChange={e => setCode(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-center text-3xl tracking-[0.5em] font-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required />
                  </div>
                  {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold text-center">{error}</div>}
                  <Button type="submit" size="lg" className="w-full bg-primary h-14 rounded-2xl font-black" disabled={loading}>
                    {loading ? 'Confirming...' : 'Verify Code'}
                  </Button>
                  <button type="button" onClick={handleClose} className="w-full mt-4 text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                </form>
              </motion.div>
            )}

            {mode === 'setup' && (
              <motion.div key="setup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">New Password</h2>
                  <p className="text-white/40 text-sm">Set a unique password for your portal access.</p>
                </div>
                <form onSubmit={handleSetup} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">New Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={inputCls} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-primary tracking-[0.2em] uppercase ml-1">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputCls} required />
                  </div>
                  {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[11px] font-bold text-center">{error}</div>}
                  <Button type="submit" size="lg" className="w-full bg-primary h-14 rounded-2xl font-black" disabled={loading}>
                    {loading ? 'Saving...' : 'Set Password'}
                  </Button>
                  <button type="button" onClick={handleClose} className="w-full mt-4 text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                </form>
              </motion.div>
            )}

            {mode === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="inline-block p-6 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase italic">Password Set</h2>
                <p className="text-white/40 text-sm mb-10">Your password has been updated. Sign in below.</p>
                <Button onClick={() => setMode('signin')} size="lg" className="w-full bg-primary h-14 rounded-2xl font-black">
                  Sign In Now
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold";
