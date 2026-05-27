"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Creator } from "@/lib/creators";
import { Section } from "@/components/layout/Section";

import { CreatorMediaBox } from "@/components/ui/CreatorMediaBox";

const CreatorCardImage = ({ creator }: { creator: Creator }) => {
  const images = creator.images && creator.images.length > 0 ? creator.images : [creator.image];
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      <CreatorMediaBox
        images={images}
        name={creator.name}
        imageClassName="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0 group-hover:brightness-110"
      />
    </div>
  );
};

const CreatorCard = ({ creator, isUserSection, isLive, index }: { creator: Creator, isUserSection: boolean, isLive: boolean, index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(mouseX);
  const mouseYSpring = useSpring(mouseY);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const shineOpacity = useTransform(mouseXSpring, [0, 300], [0, 0.3]);
  const shineX = useTransform(mouseXSpring, [0, 300], ["0%", "100%"]);
  const shineY = useTransform(mouseYSpring, [0, 500], ["0%", "100%"]);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;

    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;

    x.set(xPct);
    y.set(yPct);
    mouseX.set(mouseXVal);
    mouseY.set(mouseYVal);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="perspective-1000"
    >
      <Link 
        href={`/creators/${creator.id}`} 
        className="block group relative h-full"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <motion.div 
          style={{ rotateX, rotateY }}
          className={`relative overflow-hidden rounded-[2rem] glass-card border border-foreground/10 transition-all duration-500 h-full flex flex-col ${isLive ? 'shadow-[0_0_40px_rgba(255,60,95,0.2)] ring-1 ring-primary/50' : 'group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:border-primary/30'}`}
        >
          {/* Animated Shine/Glare Overlay */}
          <motion.div 
            style={{ 
              opacity: shineOpacity,
              background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.4) 0%, transparent 80%)`,
            }}
            className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-300"
          />

          {/* Animated Border Beam (Only on hover) */}
          <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-[-1px] rounded-[2rem] bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm animate-shine" />
          </div>

          {/* Background Image (Custom) */}
          {creator.backgroundUrl && (
            <div 
              className="absolute inset-0 z-0 transition-opacity duration-500"
              style={{ opacity: (creator.backgroundContrast ?? 100) / 100 }}
            >
              <img 
                src={creator.backgroundUrl} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Image Container */}
          <div className="aspect-[4/5] overflow-hidden relative z-10">
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/20 via-transparent to-background/60 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            
            {isLive && (
              <div className="absolute top-4 left-4 z-40 flex items-center gap-1.5 bg-primary px-3 py-1.5 rounded-full shadow-lg shadow-primary/20 scale-90 origin-left group-hover:scale-100 transition-transform duration-300">
                <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                <span className="text-[10px] font-black text-foreground tracking-widest uppercase">Live</span>
              </div>
            )}
            
            {isUserSection && (
              <div className="absolute top-4 left-4 z-40 flex items-center gap-1.5 bg-green-500 px-3 py-1.5 rounded-full shadow-lg shadow-green-500/20">
                <span className="text-[10px] font-black text-foreground tracking-widest uppercase">You</span>
              </div>
            )}

            {/* Hover Floating Category */}
            <div className="absolute top-4 right-4 z-40 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
               <span className="px-2.5 py-1 rounded-full bg-background/40 backdrop-blur-md border border-foreground/10 text-[9px] font-bold text-foreground uppercase tracking-tighter">
                 {creator.category?.[0] || 'Creator'}
               </span>
            </div>

            <CreatorCardImage creator={creator} />
          </div>

          {/* Content Area */}
          <div className="relative p-6 pt-2 mt-auto z-40 bg-gradient-to-t from-background via-background/80 to-transparent">
            <motion.div 
              initial={false}
              className="flex items-center gap-2 mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            >
              <span className="h-[2px] w-5 bg-primary rounded-full" />
              <span className="text-[10px] font-bold text-foreground tracking-[0.2em] uppercase opacity-80">
                {creator.title || (Array.isArray(creator.category) ? creator.category[0] : creator.category)}
              </span>
            </motion.div>

            <h4 className="text-2xl font-black text-foreground mb-1 group-hover:text-primary transition-colors duration-300 dark:[text-shadow:0_2px_10px_rgba(0,0,0,0.5)] leading-tight">
              {creator.name}
            </h4>

            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground/50 font-mono group-hover:text-foreground/80 transition-colors">
                @{creator.handle.replace('@', '')}
              </p>
              
              <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 overflow-hidden h-0 group-hover:h-8 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
              {creator.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[9px] font-bold px-2 py-1 rounded-md bg-foreground/5 text-foreground/40 border border-foreground/10 uppercase tracking-wider">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const CreatorGrid = ({ title, desc, list, liveHandles = [], isUserSection = false }: { title: string, desc?: string, list: Creator[], liveHandles?: string[], isUserSection?: boolean }) => {
  const isCreatorLive = (creator: Creator) => {
    const handle = creator.handle.toLowerCase();
    return liveHandles.includes(handle) || 
           !!(creator.liveUrl && liveHandles.some(lh => creator.liveUrl?.toLowerCase().includes(lh.toLowerCase())));
  };

  if (list.length === 0) return null;
  return (
    <div className="mb-32 last:mb-0">
      <div className="mb-12 relative">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(255,60,95,0.5)]" />
        <h3 className="text-4xl font-black text-foreground tracking-tight pl-4 uppercase italic">{title}</h3>
        {desc && <p className="text-foreground-muted mt-2 text-sm max-w-2xl pl-4">{desc}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {list.map((creator, i) => (
          <CreatorCard 
            key={creator.id} 
            creator={creator} 
            isUserSection={isUserSection} 
            isLive={isCreatorLive(creator)} 
            index={i}
          />
        ))}
      </div>
    </div>
  );
};


interface LiveCreator {
  username: string;
  avatar?: string;
}

import { SiteSettings } from "@/lib/creators-db";

export function OurCreators({ isMainPage = false, initialCreators = [], settings }: { isMainPage?: boolean, initialCreators?: Creator[], settings: SiteSettings['rosterSettings'] }) {
  const creators = initialCreators;
  const [liveCreators, setLiveCreators] = useState<LiveCreator[]>([]);

  useEffect(() => {
    fetch('/api/tiktok/live')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.status === 'success' && data.data?.live_creators) {
          setLiveCreators(data.data.live_creators);
        }
      })
      .catch(console.error);
  }, []);


  const staffCreators = creators.filter(c => c.tier === 'staff');
  const recruiterCreators = creators.filter(c => c.tier === 'recruiter');
  const topCreators = creators.filter(c => c.tier === 'top').slice(0, 5);
  const newCreators = creators.filter(c => c.tier === 'new').slice(0, 5);

  const displayCreators = isMainPage ? [...staffCreators, ...recruiterCreators, ...topCreators, ...newCreators] : creators;

  const liveHandles = liveCreators.map(lc => lc.username.toLowerCase());
  const liveRoster = displayCreators.filter(c => 
    liveHandles.includes(c.handle.toLowerCase()) || 
    (c.liveUrl && liveHandles.some(lh => c.liveUrl?.toLowerCase().includes(lh)))
  );

  // Extract all unique tags
  const allTags = isMainPage
    ? Array.from(new Set(displayCreators.flatMap(c => c.category))).sort()
    : Array.from(new Set(creators.flatMap(c => c.tags))).sort();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter creators based on the selected tag
  const filteredCreators = selectedTag
    ? displayCreators.filter(c => isMainPage ? c.category.includes(selectedTag) : c.tags.includes(selectedTag))
    : displayCreators;

  const s = settings;

  return (
    <Section id="creators" className="relative overflow-hidden bg-background-surface border-y border-border">
      <div className="absolute inset-0 bg-dot-grid opacity-40 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
      <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {isMainPage && (
          <div className="absolute top-0 left-4 md:left-8 z-50">
            <Link
              href="/creators"
              className="group flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-full transition-all duration-300 text-xs sm:text-sm font-bold text-foreground/80 hover:text-foreground backdrop-blur-md"
            >
              <span className="text-primary group-hover:-translate-x-1 transition-transform hidden sm:inline">←</span>
              View All Creators
            </Link>
          </div>
        )}
        <div className="mb-12 text-center max-w-4xl mx-auto px-4 pt-16 md:pt-4">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-4"
          >
            {s.mainTag}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 [text-shadow:0_0_1.5px_rgba(0,0,0,0.8)]"
          >
            {s.mainTitle} <span className="text-primary">{s.mainTitleAccent}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground-muted text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {s.mainDescription}
          </motion.p>
        </div>

        <div className="px-4 md:px-8 lg:px-12">

          {liveRoster.length > 0 && (
            <CreatorGrid
              title={s.sections.liveNow.title}
              desc={s.sections.liveNow.desc}
              list={liveRoster}
              liveHandles={liveHandles}
            />
          )}

          {/* Tag Filter System */}
          <div className="mb-12 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-widest mb-4">Filter by Category</h3>
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${selectedTag === null
                  ? "bg-primary text-foreground-inverse border-primary shadow-neon-primary"
                  : "bg-foreground/5 text-foreground/60 border-foreground/10 hover:bg-foreground/10 hover:text-foreground"
                  }`}
              >
                All Creators
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${selectedTag === tag
                    ? "bg-primary text-foreground-inverse border-primary shadow-neon-primary"
                    : "bg-foreground/5 text-foreground/60 border-foreground/10 hover:bg-foreground/10 hover:text-foreground"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={selectedTag || "all"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredCreators.length > 0 ? (
              selectedTag ? (
                <CreatorGrid
                  title={`${selectedTag} Creators`}
                  desc={`Showing creators specialized in ${selectedTag}.`}
                  list={filteredCreators}
                  liveHandles={liveHandles}
                />
              ) : (
                <div className="flex flex-col">
                  <CreatorGrid
                    title={s.sections.agencyStaff.title}
                    desc={s.sections.agencyStaff.desc}
                    list={filteredCreators.filter(c => c.tier === 'staff' || c.tier === 'recruiter')}
                    liveHandles={liveHandles}
                  />
                  {!isMainPage ? (
                    <CreatorGrid
                      title={s.sections.allCreators.title}
                      desc={s.sections.allCreators.desc}
                      list={filteredCreators.filter(c => c.tier !== 'staff' && c.tier !== 'recruiter')}
                      liveHandles={liveHandles}
                    />
                  ) : (
                    <>
                      <CreatorGrid
                        title={s.sections.topPerforming.title}
                        desc={s.sections.topPerforming.desc}
                        list={filteredCreators.filter(c => c.tier === 'top').slice(0, 5)}
                        liveHandles={liveHandles}
                      />
                      <CreatorGrid
                        title={s.sections.newests.title}
                        desc={s.sections.newests.desc}
                        list={filteredCreators.filter(c => c.tier === 'new').slice(0, 5)}
                        liveHandles={liveHandles}
                      />
                    </>
                  )}
                </div>
              )
            ) : (
              <div className="text-center py-24 glass-card rounded-3xl border border-dashed border-foreground/10">
                <p className="text-foreground/40 font-medium">No creators are currently listed in this category. Check back soon!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
