import { getCreatorsFromDb, getSiteSettingsFromDb } from "@/lib/creators-db";
import ApplyClient from "./ApplyClient";

export const metadata = {
  title: "Apply | Peace Time Agency",
  description: "Join the Peace Time Agency roster and level up your TikTok LIVE experience.",
};

export default async function ApplicationPage() {
    const creators = await getCreatorsFromDb();
    const settings = await getSiteSettingsFromDb();
    return <ApplyClient initialCreators={creators} settings={settings} />;
}
