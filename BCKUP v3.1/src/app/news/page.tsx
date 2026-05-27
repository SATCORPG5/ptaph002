import { motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { getNewsFromDb } from "@/lib/creators-db";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { ClientMotionDiv, ClientMotionH1, ClientMotionP } from "@/components/layout/ClientMotion";

export const metadata = {
  title: "Agency News | Peace Time Agency",
};

export default async function NewsPage() {
  const articles = await getNewsFromDb();

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <Section>
        <ClientMotionP
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xs font-black text-primary tracking-[0.3em] uppercase mb-4"
        >
          Agency Intelligence
        </ClientMotionP>
        <ClientMotionH1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-20 uppercase leading-[0.85]"
        >
          <span className="text-foreground">Insights &</span><br />
          <span className="text-gradient-primary">Updates.</span>
        </ClientMotionH1>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
               <ArrowRight className="w-8 h-8 text-primary rotate-45" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Updates Currently Available</h2>
            <p className="text-foreground/60 max-w-md">Check back later for peace time news, press releases, and insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <Link key={article.slug} href={`/news/${article.slug}`} className="group relative">
                <ClientMotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="h-full flex flex-col glass-card overflow-hidden hover:shadow-neon-primary/20 transition-all duration-500 hover:-translate-y-2 border-white/5"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-foreground-subtle uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {article.date}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {article.author}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-foreground-muted text-sm line-clamp-3 leading-relaxed mb-8">
                      {article.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group-hover:gap-4 transition-all">
                      Read Intelligence <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </ClientMotionDiv>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
