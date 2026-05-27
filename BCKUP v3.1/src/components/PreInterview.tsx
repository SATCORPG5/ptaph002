'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreInterview() {
  const [formData, setFormData] = useState({ name: '', tiktok: '', email: '', discordId: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.tiktok || !formData.email || !formData.discordId) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/pre-interview/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div id="community" className="h-full glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-center overflow-hidden relative group">
      {/* Red ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-primary/[0.04] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 space-y-2 mb-6 text-center">
        <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">Connect With Us</p>
        <h3 className="text-2xl font-black text-foreground tracking-tight">Pre-Interview Request</h3>
        <p className="text-sm text-foreground-muted leading-relaxed max-w-sm mx-auto">
          Not ready for a full application? Drop your handle and we&apos;ll reach out if you&apos;re a fit for our roster.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-bold text-foreground mb-2">Request Received</h4>
              <p className="text-xs text-foreground-muted">Our talent team will review your profile.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={status === 'submitting'}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="TikTok Handle"
                  className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  disabled={status === 'submitting'}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={status === 'submitting'}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Discord ID"
                  className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  value={formData.discordId}
                  onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                  disabled={status === 'submitting'}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full h-11 rounded-xl font-bold text-sm text-foreground-inverse bg-primary hover:bg-primary-dark transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,60,95,0.4)] disabled:opacity-50"
              >
                {status === 'submitting' ? 'Sending...' : 'Request Pre-Interview'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
