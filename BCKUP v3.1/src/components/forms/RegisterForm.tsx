// src/components/forms/RegisterForm.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { signup } from "@/app/(auth)/actions";
import CreatorPortalModal from "@/components/forms/CreatorPortalModal";

export default function RegisterForm() {
  const [isPortalOpen, setPortalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // The signup action will redirect on error via query param, but we handle client-side errors if needed
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-[80vh]">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground" action={signup}>
        <h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-michroma)] text-center">Join The Roster</h1>
        <p className="text-white/60 text-center mb-6 text-sm">
          Submit your application to join Peace Time Agency
        </p>
        {errorMessage && (
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-md mb-4 text-sm text-center">
            {errorMessage}
          </div>
        )}
        <label className="text-md font-semibold" htmlFor="email">Email</label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-white/20 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md font-semibold" htmlFor="password">Password</label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-white/20 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-cyan-600 hover:bg-cyan-500 font-semibold text-white rounded-md px-4 py-2 mb-2 transition-colors">
          Submit Application
        </button>
        <button
          type="button"
          onClick={() => setPortalOpen(true)}
          className="ml-2 bg-purple-600 hover:bg-purple-500 font-semibold text-white rounded-md px-4 py-2 mb-2 transition-colors"
        >
          Creator Portal
        </button>
        <div className="text-center text-sm text-white/60 mt-4">
          Already on the roster?{' '}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </form>
      <CreatorPortalModal isOpen={isPortalOpen} onClose={() => setPortalOpen(false)} />
    </div>
  );
}
