import { Hero } from "@/components/layout/Hero";
import { Services } from "@/components/layout/Services";
import { OurCreators } from "@/components/layout/OurCreators";
import { GrowthPhases } from "@/components/layout/GrowthPhases";
import { FAQ } from "@/components/layout/FAQ";
import { Footer } from "@/components/layout/Footer";
import Testimonials from "@/components/Testimonials";
import WhosLiveNow from "@/components/WhosLiveNow";
import { getCreatorsFromDb, getSiteSettingsFromDb } from "@/lib/creators-db";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const creators = await getCreatorsFromDb();
  const settings = await getSiteSettingsFromDb();
  
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero settings={settings.hero} />
      <Services settings={settings.services} />
      <GrowthPhases settings={settings.growthPhases} />
      <WhosLiveNow settings={settings.liveSection} initialCreators={creators} />
      <OurCreators isMainPage={true} settings={settings.rosterSettings} initialCreators={creators} />

      <Testimonials settings={settings.testimonials} />

      <FAQ settings={settings.faqs} />
      <Footer settings={settings.footer} />
    </main>
  );
}
