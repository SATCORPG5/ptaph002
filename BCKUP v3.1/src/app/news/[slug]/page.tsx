import { Section } from "@/components/layout/Section";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsFromDb } from "@/lib/creators-db";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { ClientMotionDiv, ClientMotionH1 } from "@/components/layout/ClientMotion";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getNewsFromDb();
  const article = articles.find((a) => a.slug === slug);

  return {
    title: article ? `${article.title} | PTA Intel` : "Not Found",
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getNewsFromDb();
  const article = articles.find((a) => a.slug === slug);

  if (!article) return notFound();

  return (
    <main className="min-h-screen bg-background pb-24">
      <Section className="pt-32">
        <Link href="/news" className="inline-flex items-center gap-2 text-xs font-black text-foreground-muted hover:text-primary transition-all mb-12 group uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Archives
        </Link>

        <div className="max-w-4xl mx-auto">
          <ClientMotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 shadow-neon-primary/10">
                {article.category}
              </span>
              <div className="h-px w-8 bg-white/5" />
              <div className="flex items-center gap-4 text-[10px] font-bold text-foreground-subtle uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {article.date}</span>
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-white mb-12 tracking-tighter leading-[0.9] uppercase">
              {article.title}
            </h1>
          </ClientMotionDiv>

          <ClientMotionDiv
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative aspect-video rounded-[40px] overflow-hidden mb-20 shadow-2xl border border-white/5"
          >
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </ClientMotionDiv>

          <div className="max-w-3xl mx-auto">
            <article className="prose prose-invert prose-p:text-foreground-muted prose-p:text-lg prose-p:leading-relaxed prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-primary max-w-none">
              <p className="text-2xl text-white font-black leading-tight italic border-l-4 border-primary pl-8 py-4 bg-white/[0.02] rounded-r-3xl mb-16">
                {article.excerpt}
              </p>
              
              <div className="space-y-8 text-foreground-muted/80">
                <p>
                  In the ever-evolving landscape of live broadcasting, the metrics that defined success in 2024 are no longer the benchmarks for 2026. At Peace Time Agency, we&apos;ve spent the last six months deep-diving into the algorithmic shifts that prioritize retention over raw vanity metrics.
                </p>
                
                <h2 className="text-3xl mt-16 mb-8 uppercase tracking-widest">Strategic Positioning</h2>
                
                <p>
                  Our core philosophy has always been creator-first. This means we don&apos;t just look at how many coins are being dropped, but how many recurring viewers are coming back every single night. The &quot;PTA Method&quot; focuses on the bridge between casual scrolling and dedicated fandom.
                </p>

                <div className="glass-card p-10 rounded-[40px] border-primary/20 my-16 bg-gradient-to-br from-white/[0.03] to-transparent">
                  <h3 className="text-xl font-black text-primary uppercase tracking-widest mb-8 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-neon-primary" />
                    Key Directives
                  </h3>
                  <ul className="space-y-6 list-none p-0 m-0">
                    <li className="flex gap-6 items-start">
                      <span className="text-primary font-black text-xl italic leading-none pt-1">01.</span>
                      <div className="space-y-1">
                        <strong className="text-white uppercase tracking-widest text-sm block">Consistency Over Intensity</strong>
                        <span className="text-base">Short, high-quality streams beat 12-hour marathons for algorithmic retention.</span>
                      </div>
                    </li>
                    <li className="flex gap-6 items-start">
                      <span className="text-primary font-black text-xl italic leading-none pt-1">02.</span>
                      <div className="space-y-1">
                        <strong className="text-white uppercase tracking-widest text-sm block">Engine Interaction</strong>
                        <span className="text-base">Your chat is your engine; fuel it with value-based interaction to drive longevity.</span>
                      </div>
                    </li>
                    <li className="flex gap-6 items-start">
                      <span className="text-primary font-black text-xl italic leading-none pt-1">03.</span>
                      <div className="space-y-1">
                        <strong className="text-white uppercase tracking-widest text-sm block">Radical Transparency</strong>
                        <span className="text-base">Creators deserve to see the same raw telemetry data the agency sees. No hidden hooks.</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <p>
                  As we move further into the year, our commitment to providing the highest fidelity infrastructure remains unchanged. The goal isn&apos;t just to be seen; it&apos;s to be remembered.
                </p>
              </div>

              <div className="mt-24 pt-16 border-t border-white/5 flex flex-col items-center">
                <span className="text-[10px] font-black text-foreground-subtle uppercase tracking-[0.5em] mb-8">End of Transmission</span>
                <Link href="/recruiters" className="group relative h-16 px-16 bg-gradient-to-r from-primary to-primary-dark text-white font-black rounded-2xl flex items-center justify-center transition-all uppercase tracking-[0.3em] shadow-neon-primary/20 hover:shadow-neon-primary/40 hover:-translate-y-2 overflow-hidden">
                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                   <span className="relative z-10">Join the Roster</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </Section>
    </main>
  );
}
