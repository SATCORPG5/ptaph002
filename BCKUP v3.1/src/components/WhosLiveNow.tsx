'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Creator } from '@/lib/creators';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

interface LiveCreator {
  id: string;
  username: string;
  displayName: string;
  viewerCount: number;
  category: string;
  stream_title: string;
}

import { SiteSettings } from '@/lib/creators-db';

export default function WhosLiveNow({ initialCreators = [], settings }: { initialCreators?: Creator[], settings: SiteSettings['liveSection'] }) {
  const [loading, setLoading] = useState(true);
  const [liveCreators, setLiveCreators] = useState<LiveCreator[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const constraintsRef = useRef(null);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/tiktok/live');
        const data = await res.json();
        if (data.status === 'success' && data.data?.live_creators) {
          setLiveCreators(data.data.live_creators);
          setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        console.error('Failed to fetch live creators:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
    const interval = setInterval(fetchLive, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const formatViewers = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'k';
    return count.toString();
  };

  const getCreatorAvatar = (id: string, username: string) => {
    const creator = initialCreators.find(c => c.id === id || c.handle.toLowerCase() === username.toLowerCase());
    return creator?.image || `https://i.pravatar.cc/150?u=${id}`;
  };

  if (!loading && liveCreators.length === 0) return null;

  return (
    <div id="live" className="w-full overflow-hidden py-12 relative bg-background-surface">
      {/* Top/bottom edge fades */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Header */}
      <div className="container mx-auto px-4 mb-10 flex justify-between items-end relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <div>
            <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-1">{settings?.tag || "Live Now"}</p>
            <h2 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              {settings?.title || "Elite Creators Broadcasting"}
              {lastSync && (
                <span className="text-[10px] font-mono font-medium text-foreground/30 bg-white/[0.03] px-2 py-1 rounded border border-white/[0.05]">
                  SYNC: {lastSync}
                </span>
              )}
            </h2>
          </div>
        </div>
        <Link href="/creators" className="hidden sm:flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors group font-medium">
          View All Roster
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Side fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background-surface to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background-surface to-transparent z-10 pointer-events-none" />

      {/* Scrolling track / Draggable */}
      <div className="relative z-10" ref={constraintsRef}>
        <motion.div 
          drag={liveCreators.length > 3 ? "x" : false}
          dragConstraints={constraintsRef}
          className={`flex w-fit gap-4 px-12 ${!loading && liveCreators.length > 3 ? 'cursor-grab active:cursor-grabbing' : ''}`}
          animate={!loading && liveCreators.length > 4 ? { x: [0, -1000] } : {}}
          transition={!loading && liveCreators.length > 4 ? {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          } : {}}
          whileTap={{ cursor: "grabbing" }}
        >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`skel-${i}`} className="w-60 min-h-[140px] p-4 flex flex-col justify-between" />
          ))
        ) : (
          [...liveCreators, ...liveCreators].map((creator, i) => {
            const avatar = getCreatorAvatar(creator.id, creator.username);
            return (
              <div
                key={`${creator.id}-${i}`}
                className="relative shrink-0 w-64 group cursor-pointer"
              >
                {/* Hover glow border */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/40 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />

                <Link href={`/creators/${creator.id}`} className="block relative glass-card rounded-2xl p-4 transition-transform duration-300 group-hover:-translate-y-1.5 h-full">
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />

                  {/* Avatar + info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full ring-2 ring-primary/50 overflow-hidden animate-live-ring">
                        <img
                          src={avatar}
                          alt={creator.displayName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-foreground-inverse text-[9px] font-black px-1 py-px rounded-full leading-none uppercase">
                        Live
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground text-sm truncate">{creator.displayName}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary truncate max-w-full">
                          {creator.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Viewer count */}
                  <div className="flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/[0.06] px-3 py-2">
                    <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                      />
                      {/* {formatViewers(creator.viewerCount)} watching */}
                      Live Now
                    </div>
                    <span className="text-[10px] text-foreground-subtle font-medium">PTA</span>
                  </div>
                </Link>
              </div>
            );
          })
        )}
        </motion.div>
      </div>
    </div>
  );
}
