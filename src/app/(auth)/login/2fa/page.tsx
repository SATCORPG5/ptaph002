'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPortalRoute } from '@/lib/portal';

function TwoFactorContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const creatorId = sp.get('creator_id') || '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown > 0) { const t = setTimeout(() => setCooldown(c => c - 1), 1000); return () => clearTimeout(t); }
  }, [cooldown]);

  function handleDigit(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
    if (next.every(d => d)) submitCode(next.join(''));
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  async function submitCode(code: string) {
    setLoading(true); setError(null);
    const res = await fetch('/api/auth/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId, code }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      router.push(getPortalRoute(data.tier));
    } else {
      const d = await res.json();
      setError(d.error || 'Invalid code');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }

  async function resendCode() {
    if (cooldown > 0) return;
    setResending(true);
    await fetch('/api/auth/2fa/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId }),
    });
    setResending(false);
    setCooldown(60);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01020A] to-black flex items-center justify-center p-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0F1623] border border-white/10 rounded-[2.5rem] p-10 max-w-sm w-full"
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 -mt-10 mb-8 -mx-10" />

        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black uppercase italic">Two-Factor Auth</h1>
          <p className="text-white/40 text-sm mt-2">Enter the 6-digit code sent to your email.</p>
        </div>

        {/* Digit inputs */}
        <div className="flex gap-2 justify-center mb-6">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-11 h-14 text-center text-2xl font-black rounded-xl border bg-white/5 text-white focus:outline-none transition-all ${
                d ? 'border-primary' : 'border-white/20 focus:border-primary/50'
              }`}
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center mb-4">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {error && <p className="text-red-400 text-xs font-bold text-center mb-4">{error}</p>}

        <button
          onClick={resendCode}
          disabled={cooldown > 0 || resending}
          className="w-full text-white/40 hover:text-primary disabled:text-white/20 text-[11px] font-black uppercase tracking-widest transition-colors"
        >
          {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
        </button>

        <button
          onClick={() => router.push('/login')}
          className="w-full mt-3 text-white/20 hover:text-white/40 text-[10px] font-black uppercase tracking-widest transition-colors"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
}

export default function TwoFactorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-[#01020A] to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <TwoFactorContent />
    </Suspense>
  );
}
