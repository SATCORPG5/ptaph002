// src/app/(auth)/login/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";

function LoginContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const errorParam = sp.get('error');
  const [modalOpen, setModalOpen] = useState(false);

  const handleTikTokLogin = () => router.push("/api/auth/tiktok/login");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#01020A] to-black text-white p-4">
      <div className="glass-card p-10 rounded-[2.5rem] max-w-md w-full text-center">
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 -mx-10 -mt-10 mb-8" />

        <h1 className="mb-2 text-3xl font-black uppercase italic tracking-tight text-white">Creator Login</h1>
        <p className="mb-8 text-sm text-white/40">Sign in to manage your creator profile and access the portal.</p>

        {errorParam && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-bold uppercase tracking-wider">
            {errorParam}
          </div>
        )}

        <button
          onClick={handleTikTokLogin}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF1A43] hover:bg-[#D90026] px-6 py-4 text-sm font-black uppercase tracking-widest transition-all mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.54V6.79a4.85 4.85 0 01-1.07-.1z" />
          </svg>
          Sign In with TikTok
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0b101a] px-4 text-white/30 font-bold uppercase tracking-widest">Or</span>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 px-6 py-4 text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
        >
          Email / Password
        </button>
      </div>

      <p className="mt-8 text-xs font-bold text-white/20 tracking-widest uppercase">
        Protected by Peace Time Agency
      </p>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#01020A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
