import { getCreatorsFromDb } from "@/lib/creators-db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { 
  Twitter, 
  Instagram, 
  ArrowLeft, 
  Youtube, 
  Twitch, 
  Globe, 
  Gamepad2, 
  MessageSquare, 
  ExternalLink,
  Facebook,
  Music
} from "lucide-react";
import { CreatorMediaBox } from "@/components/ui/CreatorMediaBox";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CreatorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const { id } = await params;
  const creators = await getCreatorsFromDb();
  const creator = creators.find((c) => c.id === id);

  if (!creator) return {};

  return {
    title: creator.seo?.metaTitle || `${creator.name} | Peace Time Agency`,
    description: creator.seo?.metaDescription || creator.description,
    openGraph: {
      title: creator.seo?.metaTitle || creator.name,
      description: creator.seo?.metaDescription || creator.description,
      images: [creator.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: creator.seo?.metaTitle || creator.name,
      description: creator.seo?.metaDescription || creator.description,
      images: [creator.image],
    }
  };
}

export async function generateStaticParams() {
  const creators = await getCreatorsFromDb();
  return creators.map((creator) => ({
    id: creator.id,
  }));
}

// Deep Linking Helper
const getDeepLink = (url: string, platform: string) => {
  if (!url) return url;
  try {
    const uri = new URL(url);
    const handle = uri.pathname.replace(/\//g, '');
    
    switch (platform) {
      case 'instagram':
        return `instagram://user?username=${handle}`;
      case 'tiktok':
        return `snssdk1233://user/profile/${handle}`; // TikTok scheme varies, but this is a common one
      case 'discord':
        return url; // Discord usually handles this via protocol
      default:
        return url;
    }
  } catch (e) {
    return url;
  }
};

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { id } = await params;
  const creators = await getCreatorsFromDb();
  const creator = creators.find((c) => c.id === id);

  if (!creator) {
    notFound();
  }

  const accentColor = creator.customization?.themeColor || creator.accentColor || "var(--color-primary)";
  const fontFamily = creator.customization?.fontFamily || "Inter";

  // A/B Testing Logic (Randomized for demo)
  const showAlt = creator.abTest?.enabled && Math.random() > 0.5;
  const displayBio = showAlt && creator.abTest?.altBio ? creator.abTest.altBio : creator.description;
  const displayImage = showAlt && creator.abTest?.altImage ? creator.abTest.altImage : creator.image;

  return (
    <div 
      className="min-h-screen bg-background text-foreground pt-24 pb-12 overflow-x-hidden"
      style={{ 
        "--accent-color": accentColor,
        fontFamily: fontFamily === 'Inter' ? 'var(--font-sans)' : `var(--font-${fontFamily.toLowerCase().replace(' ', '-')})`
      } as React.CSSProperties}
    >
      {/* Background Effects */}
      {creator.backgroundUrl ? (
        <div 
          className="fixed inset-0 z-0"
          style={{ opacity: (creator.backgroundContrast ?? 100) / 100 }}
        >
          <img 
            src={creator.backgroundUrl} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <>
          <div className="fixed inset-0 bg-dot-grid opacity-10 dark:opacity-20 pointer-events-none" />
          <div className="fixed inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
        </>
      )}

      {/* Dynamic Background Animations */}
      {creator.customization?.bgAnimation === 'stars' && (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse" />
        </div>
      )}

      {/* Hero ambient glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] blur-[150px] pointer-events-none rounded-full z-0" 
        style={{ backgroundColor: `color-mix(in srgb, var(--accent-color), transparent 80%)` }}
      />

      <Section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Navigation */}
        <div className="mb-12">
          <Link
            href="/#creators"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition-colors group"
            style={{ color: 'var(--accent-color)' }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Network
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column: Image & Media */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden glass-card shadow-2xl border border-foreground/10 group">
              <CreatorMediaBox
                images={showAlt && creator.abTest?.altImage ? [creator.abTest.altImage] : (creator.images && creator.images.length > 0 ? creator.images : [creator.image])}
                name={creator.name}
                imageClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Category Badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <span 
                  className="px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-md border border-foreground/10 text-[10px] font-black uppercase tracking-widest"
                  style={{ color: 'var(--accent-color)' }}
                >
                  {creator.title || creator.category.join(' / ')}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            {creator.countdown?.targetDate && (
              <CountdownTimer 
                targetDate={creator.countdown.targetDate} 
                label={creator.countdown.label}
                accentColor={accentColor}
              />
            )}

            {/* Spotify Embed */}
            {creator.embeds?.spotify && (
              <div className="rounded-3xl overflow-hidden glass-card p-2 border border-foreground/5">
                <iframe 
                  src={creator.embeds.spotify.replace('open.spotify.com', 'open.spotify.com/embed')} 
                  width="100%" 
                  height="152" 
                  frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="rounded-2xl"
                />
              </div>
            )}
          </div>

          {/* Right Column: Info & Links */}
          <div className="lg:col-span-7 flex flex-col">

            <div className="mb-8">
              <h1 className="text-6xl lg:text-8xl font-black text-foreground tracking-tighter mb-4 flex items-center gap-4 flex-wrap leading-none">
                {creator.name}
              </h1>
              <a
                href={creator.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-mono tracking-wide hover:underline inline-block"
                style={{ color: 'var(--accent-color)' }}
              >
                {creator.handle}
              </a>
            </div>

            <div className="mb-12">
              <h3 className="text-xs font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">Transmission Bio</h3>
              <p className="text-xl text-foreground/80 leading-relaxed font-medium">
                {displayBio}
              </p>
            </div>

            {/* Social Icons Row */}
            <div className="mb-12 flex flex-wrap gap-4">
              {[
                { icon: Twitter, url: creator.socials.twitter, color: '#1DA1F2', platform: 'twitter' },
                { icon: Instagram, url: creator.socials.instagram, color: '#E1306C', platform: 'instagram' },
                { icon: Youtube, url: creator.socials.youtube, color: '#FF0000', platform: 'youtube' },
                { icon: Twitch, url: creator.socials.twitch, color: '#9146FF', platform: 'twitch' },
                { icon: MessageSquare, url: creator.socials.discord, color: '#5865F2', platform: 'discord' },
                { icon: Globe, url: creator.socials.website, color: '#10b981', platform: 'website' },
                { icon: Facebook, url: (creator.socials as any).facebook, color: '#1877F2', platform: 'facebook' },
              ].filter(s => s.url).map((social, i) => (
                <a 
                  key={i}
                  href={getDeepLink(social.url!, social.platform)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-4 bg-foreground/5 border border-foreground/10 rounded-2xl hover:scale-110 transition-all text-foreground/60 hover:text-foreground"
                  style={{ '--hover-color': social.color } as any}
                >
                  <social.icon className="w-6 h-6 transition-colors group-hover:text-[var(--hover-color)]" />
                </a>
              ))}
            </div>

            {/* YouTube Embed */}
            {creator.embeds?.youtube && (
              <div className="mb-12">
                <h3 className="text-xs font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">Latest Transmission</h3>
                <div className="aspect-video rounded-3xl overflow-hidden glass-card border border-foreground/10">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={creator.embeds.youtube.replace('watch?v=', 'embed/')} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Custom Links */}
            {(creator.customLinks && creator.customLinks.length > 0) && (
              <div className="mb-12">
                <h3 className="text-xs font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">External Receptors</h3>
                <div className="grid grid-cols-1 gap-4">
                  {creator.customLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-6 bg-foreground/5 border border-foreground/10 rounded-3xl hover:bg-foreground/10 hover:border-primary/50 transition-all group flex items-center justify-between"
                    >
                      <span className="text-lg font-black text-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                      <ExternalLink className="w-6 h-6 text-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            <div className="mb-12">
              <h3 className="text-xs font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">Core Specialists</h3>
              <div className="flex flex-wrap gap-2">
                {creator.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-xl bg-foreground/5 border border-foreground/10 text-xs font-black text-foreground/40 uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </Section>
    </div>
  );
}
