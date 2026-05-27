// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";

export default function LoginPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleTikTokLogin = async () => {
    // Redirect to the TikTok OAuth initiation endpoint
    router.push("/api/auth/tiktok/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#01020A] to-black text-white p-4">
      <div className="glass-card p-10 rounded-[2.5rem] max-w-md w-full text-center">
        <h1 className="mb-2 text-3xl font-black uppercase italic tracking-tight text-white">Creator Login</h1>
        <p className="mb-10 text-sm text-foreground-muted">Sign in to manage your creator profile and access the CRM.</p>
        
        <button
          onClick={handleTikTokLogin}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF1A43] hover:bg-[#D90026] px-6 py-4 text-sm font-black uppercase tracking-widest transition-all mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5l-1.41 1.41L12 13.41l-2.09 2.5-1.41-1.41L10.59 12 8.5 9.91l1.41-1.41L12 10.59l2.09-2.5 1.41 1.41L13.41 12l2.09 2.5z" />
          </svg>
          Login with TikTok
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0b101a] px-4 text-foreground-subtle font-bold uppercase tracking-widest">Or</span>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 px-6 py-4 text-sm font-black uppercase tracking-widest text-foreground-muted hover:text-white transition-all"
        >
          Staff / Legacy Login
        </button>
      </div>

      <p className="mt-8 text-xs font-bold text-foreground-subtle tracking-widest uppercase">
        Protected by Peace Time Agency
      </p>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
