"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Section } from "@/components/layout/Section";

export default function AuthSuccessPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/tiktok/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          // If no profile, they aren't authenticated properly
          router.push("/apply");
        }
      } catch (e) {
        console.error("Failed to load profile", e);
        router.push("/apply");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleDisconnect = async () => {
    try {
      await fetch("/api/auth/tiktok/disconnect", { method: "POST" });
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Section className="relative z-10 w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full p-10 text-center rounded-[40px] border-primary/20 shadow-2xl backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Connection Successful</h1>
          <p className="text-foreground-muted mb-10 text-sm">Your TikTok account is securely linked.</p>

          {profile && (
            <div className="flex flex-col items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl mb-10">
              {profile.avatar_url && (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.display_name} 
                  className="w-24 h-24 rounded-full border-2 border-primary/50 mb-4 shadow-lg shadow-primary/20"
                />
              )}
              <h2 className="text-xl font-bold text-white mb-1">{profile.display_name}</h2>
              <p className="text-primary font-mono text-sm tracking-wide">
                @{profile.username}
              </p>
              {profile.follower_count && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground-subtle uppercase tracking-widest">Followers</span>
                  <span className="text-sm font-black text-white">{(profile.follower_count / 1000).toFixed(1)}k</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Link 
              href="/apply?connected=true" 
              className="block w-full py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl transition-all duration-300 uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              Complete Application
            </Link>
            
            <button 
              onClick={handleDisconnect}
              className="block w-full py-4 glass-card border-white/10 hover:border-white/20 text-foreground-muted hover:text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs"
            >
              Disconnect TikTok
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] text-foreground-subtle uppercase tracking-widest">
              By continuing, you agree to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </motion.div>
      </Section>
    </main>
  );
}
