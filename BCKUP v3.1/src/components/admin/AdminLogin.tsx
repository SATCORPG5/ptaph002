"use client";

import { useState } from "react";
import { loginWithPin } from "@/app/admin/actions";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginWithPin(pin);
      if (res?.error) {
        setError(res.error);
        setPin("");
      } else {
        router.refresh();
        window.location.reload();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Decorative Elements */}
      <div className="absolute -inset-24 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative glass-card p-10 flex flex-col items-center overflow-hidden"
      >
        <h1 className="text-4xl font-black tracking-tighter text-white mb-3 text-center">
          Admin Portal
        </h1>
        <p className="text-foreground-muted text-sm mb-10 text-center max-w-[280px] font-medium leading-relaxed">
          Welcome back. Enter your secure PIN to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6 relative z-20">
          <div className="relative group">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              maxLength={4}
              className="w-full bg-background-surface/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-[1em] text-center text-2xl backdrop-blur-md group-hover:border-white/20"
              autoFocus
            />
            <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center gap-2 text-primary text-xs font-bold uppercase tracking-widest bg-primary/10 py-2 rounded-lg border border-primary/20"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="group relative w-full h-[60px] bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-neon-primary hover:shadow-neon-primary/60 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-white relative z-10" />
            ) : (
              <>
                <span className="text-white font-black uppercase tracking-[0.2em] text-sm relative z-10">Sign In</span>
                <ArrowRight className="w-5 h-5 text-white relative z-10 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <div className="flex justify-center pt-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 rounded-full ${pin.length > i ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-white/10'}`} 
                />
              ))}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
