import { getCreatorsFromDb } from "@/lib/creators-db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Twitter, Instagram, ArrowLeft, Users } from "lucide-react";
import { CreatorMediaBox } from "@/components/ui/CreatorMediaBox";

interface RecruiterPageProps {
    params: Promise<{ id: string }>;
}

// Generate static params for build time optimization
export async function generateStaticParams() {
    const creators = await getCreatorsFromDb();
    return creators
        .filter((creator) => creator.tier === 'recruiter')
        .map((creator) => ({
            id: creator.id,
        }));
}

export default async function RecruiterPage({ params }: RecruiterPageProps) {
    const { id } = await params;
    const creators = await getCreatorsFromDb();
    const creator = creators.find((c) => c.id === id && c.tier === 'recruiter');

    if (!creator) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-24">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-dot-grid opacity-20 pointer-events-none mix-blend-screen" />
            <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />

            {/* Hero ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/20 blur-[150px] pointer-events-none rounded-full" />

            <Section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Navigation */}
                <div className="mb-12">
                    <Link
                        href="/recruiters"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Recruiters
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Left Column: Image */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <div className="relative w-full h-full min-h-[500px] lg:min-h-[700px] rounded-[2rem] overflow-hidden glass-card shadow-lg shadow-black/50 border border-foreground/10 group">
                            <CreatorMediaBox
                                images={creator.images && creator.images.length > 0 ? creator.images : [creator.image]}
                                name={creator.name}
                                imageClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* Category Badge */}
                            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                                <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-foreground/10 text-[10px] font-black text-primary uppercase tracking-widest shadow-[0_0_15px_rgba(255,60,95,0.4)]">
                                    {creator.category.join(' / ')}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Info & Stats */}
                    <div className="lg:col-span-7 flex flex-col justify-center">

                        <div className="mb-8">
                            <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-4">
                                {creator.title ? creator.title.replace(/\/Recruiter|Recruiter/g, '').trim() : 'Official Recruiter'}
                            </p>
                            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight mb-2 flex items-center gap-4 flex-wrap">
                                {creator.name}
                            </h1>
                            <a
                                href={creator.socials.tiktok}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl font-mono text-primary tracking-wide hover:underline inline-block mt-2"
                            >
                                {creator.handle}
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="mb-10 flex gap-4">
                            {creator.socials.tiktok && (
                                <a href={creator.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-3 bg-foreground/5 border border-foreground/10 rounded-full hover:bg-[#ff0050]/20 hover:border-[#ff0050]/50 hover:text-[#ff0050] transition-all text-foreground/60">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 006.27 6.36 6.33 6.33 0 006.25-6.32V8.75a8.31 8.31 0 003.5.88V6.26a6.84 6.84 0 00-1.43-.1 6.89 6.89 0 00-0.49.03z"></path>
                                    </svg>
                                </a>
                            )}
                            {creator.socials.instagram && (
                                <a href={creator.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-foreground/5 border border-foreground/10 rounded-full hover:bg-[#E1306C]/20 hover:border-[#E1306C]/50 hover:text-[#E1306C] transition-all text-foreground/60">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {creator.socials.twitter && (
                                <a href={creator.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-foreground/5 border border-foreground/10 rounded-full hover:bg-[#1DA1F2]/20 hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2] transition-all text-foreground/60">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                        </div>

                        <div className="mb-10">
                            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-widest mb-4">About Me</h3>
                            <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                                {creator.description}
                            </p>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-widest mb-4">Recruiting Focus</h3>
                            <div className="flex flex-wrap gap-2">
                                {creator.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-sm font-bold text-foreground/70 uppercase tracking-wider"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>


                        {/* Interview CTA */}
                        {/* <div className="pt-8 border-t border-foreground/10">
                            <Link
                                href={`/apply?recruiter=${creator.id}`}
                                className="inline-flex items-center justify-center h-16 px-10 rounded-xl font-black text-base text-foreground-inverse bg-primary hover:bg-primary-dark transition-all duration-300 hover:shadow-neon-primary uppercase tracking-widest w-full sm:w-auto shadow-xl shadow-primary/20"
                            >
                                Interview for {creator.name}
                            </Link>
                        </div> */}

                    </div>
                </div>
            </Section>
        </div>
    );
}
