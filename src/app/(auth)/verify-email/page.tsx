'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = sp.get('token');
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    fetch('/api/auth/email-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirm', token }),
    }).then(r => setStatus(r.ok ? 'success' : 'error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01020A] to-black flex items-center justify-center p-4 text-white">
      <div className="bg-[#0F1623] border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full text-center">
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 -mt-10 mb-8 mx-[-2.5rem]" />

        {status === 'verifying' && (
          <>
            <div className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
            <h1 className="text-2xl font-black uppercase italic">Verifying...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex p-5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-black uppercase italic mb-2">Email Verified</h1>
            <p className="text-white/40 text-sm mb-8">Your email address has been confirmed.</p>
            <button onClick={() => router.push('/portal/home')} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black text-sm uppercase tracking-widest transition-all">
              Go to Portal
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex p-5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-2xl font-black uppercase italic mb-2">Link Expired</h1>
            <p className="text-white/40 text-sm mb-8">This verification link is invalid or has expired. Request a new one from your portal settings.</p>
            <button onClick={() => router.push('/login')} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black text-sm uppercase tracking-widest transition-all">
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#01020A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
