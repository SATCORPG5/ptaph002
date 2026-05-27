import { NextRequest, NextResponse } from "next/server";
import { getTikTokProfile } from "@/lib/tiktok";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("tiktok_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getTikTokProfile(accessToken);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("TikTok Profile Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
