"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { CreatorMediaBox } from "@/components/ui/CreatorMediaBox";
import { Creator } from "@/lib/creators";

export default function RecruitersClient({ initialCreators }: { initialCreators: Creator[] }) {
    const recruiterCreators = initialCreators.filter(c => c.tier === 'recruiter');

    return (
        <main className="min-h-screen bg-background pt-12 pb-24 border-t border-border mt-[68px]">

            <div className="fixed inset-0 bg-dot-grid opacity-20 pointer-events-none mix-blend-screen" />
            <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />

            <Section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
                <div className="mb-16 text-center max-w-4xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-4"
                    >
                        Talent Acquisition
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight text-foreground mb-6 uppercase"
                    >
                        Pick Your <span className="text-gradient-primary">Recruiter.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-foreground-muted text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Browse our dedicated talent scouts and select the representative that aligns best with your brand and vision out in the field.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recruiterCreators.map((creator, i) => (
                        <motion.div
                            key={creator.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link href={`/recruiters/${creator.id}`} className="block group relative h-full">
                                <div className="relative overflow-hidden rounded-3xl glass-card transition-all duration-500 group-hover:scale-[1.02] h-full flex flex-col group-hover:shadow-neon-primary bg-foreground/[0.02] border border-foreground/10">
                                    {/* Image Container */}
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        <CreatorMediaBox
                                            images={creator.images && creator.images.length > 0 ? creator.images : [creator.image]}
                                            name={creator.name}
                                            imageClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col relative z-10 -mt-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="h-px w-4 bg-primary" />
                                            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                                                {creator.title ? creator.title.replace(/\/Recruiter|Recruiter/g, '').trim() : (Array.isArray(creator.category) ? creator.category[0] : creator.category)}
                                            </span>
                                        </div>
                                        <h4 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300">
                                            {creator.name}
                                        </h4>
                                        <p className="text-xs text-foreground/50 font-mono mb-4">
                                            {creator.handle}
                                        </p>

                                        <p className="text-sm text-foreground-muted leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {creator.description}
                                        </p>

                                        <div className="mt-auto space-y-5">
                                            <div className="flex flex-wrap gap-2">
                                                {creator.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] font-bold px-2 py-1 rounded-md bg-foreground/5 text-foreground/60 border border-foreground/10 uppercase tracking-tighter">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="w-full py-3.5 text-center border border-primary/40 rounded-xl text-xs font-black text-primary uppercase tracking-widest group-hover:bg-primary group-hover:text-foreground-inverse transition-all duration-300">
                                                View Profile
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {recruiterCreators.length === 0 && (
                    <div className="w-full text-center py-24 border border-dashed border-foreground/10 rounded-2xl glass-card">
                        <p className="text-2xl font-black text-primary uppercase tracking-[0.2em]">Coming Soon!</p>
                    </div>
                )}
            </Section>
        </main>
    );
}
