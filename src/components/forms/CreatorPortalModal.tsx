"use client";
import React, { useState } from 'react';
import { creatorLogin, creatorSignup } from '@/app/(auth)/creator/actions';

export default function CreatorPortalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === 'login') {
        const result = await creatorLogin({ email, password });
        if (result.error) throw new Error(result.error);
        setMessage('Successfully signed in!');
      } else {
        const result = await creatorSignup({ email, password, inviteCode });
        if (result.error) throw new Error(result.error);
        setMessage('Account created! You can now sign in.');
        setMode('login');
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-black/80 rounded-lg p-6 w-96 border border-white/20">
        <h2 className="text-xl font-bold text-center mb-4 text-white">{mode === 'login' ? 'Creator Sign In' : 'Creator Sign Up'}</h2>
        {message && (
          <div className={`p-2 rounded mb-4 text-sm ${message.includes('Error') ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded px-3 py-2 bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded px-3 py-2 bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Invite Code"
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              required
              className="w-full rounded px-3 py-2 bg-black/30 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Processing…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p className="text-white/70 text-sm">
              New to Peace Time?{' '}
              <button onClick={() => setMode('signup')} className="text-cyan-400 underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-white/70 text-sm">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-cyan-400 underline">
                Sign In
              </button>
            </p>
          )}
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>
      </div>
    </div>
  );
}
