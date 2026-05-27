import { getCreatorsFromDb } from "@/lib/creators-db";
import RecruitersClient from "./RecruitersClient";

export const metadata = {
  title: "Recruiters | Peace Time Agency",
  description: "Browse our dedicated talent scouts and select the representative that aligns best with your brand.",
};

export default async function RecruitersPage() {
    const creators = await getCreatorsFromDb();
    return <RecruitersClient initialCreators={creators} />;
}
