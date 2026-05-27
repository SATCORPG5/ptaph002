import { getCreatorsFromDb, getSiteSettingsFromDb } from "@/lib/creators-db";
import { OurCreators } from "@/components/layout/OurCreators";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Creators | Peace Time Agency",
  description: "Meet the elite creators of the Peace Time Agency roster.",
};

export default async function CreatorsPage() {
  const creators = await getCreatorsFromDb();
  const settings = await getSiteSettingsFromDb();
  
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-grow">
        <OurCreators initialCreators={creators} settings={settings.rosterSettings} />
      </div>
      <Footer settings={settings.footer} />
    </main>
  );
}
