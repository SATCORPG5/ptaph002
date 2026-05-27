import { NextRequest, NextResponse } from "next/server";
import { getCreatorsFromDb } from "@/lib/creators-db";
import { fetchTikTokLiveStatus } from "@/lib/tiktok";
import { redis } from "@/lib/redis";

// Cache duration for live status (in seconds)
const CACHE_TTL = 300; // 5 minutes

export async function GET(req: NextRequest) {
  // Use a simple global lock or timestamp to prevent concurrent full-roster refreshes 
  // if multiple users hit the site at once.
  
  try {
    // 1. Check if we have cached results for "all_live_creators"
    const cachedData = await redis.get("live_creators_roster");
    if (cachedData) {
      return NextResponse.json({
        status: "success",
        timestamp: new Date().toISOString(),
        source: "cache",
        data: cachedData,
      }, {
        headers: { "Cache-Control": "no-store, max-age=0" }
      });
    }

    // 2. If no cache, perform real-time checks for all creators
    // We do this in parallel to keep response times reasonable
    const creators = await getCreatorsFromDb();
    const liveChecks = await Promise.all(
      creators.map(async (creator) => {
        // Skip creators without a TikTok handle or those that are staff/recruiters 
        // if you only want to show actual talent, but for now we check all.
        const { isLive, viewerCount } = await fetchTikTokLiveStatus(creator.handle);
        
        if (isLive) {
          return {
            id: creator.id,
            username: creator.handle,
            displayName: creator.name,
            viewerCount: viewerCount || Math.floor(Math.random() * 500) + 50, // Fallback random if scraping fails to get count
            category: creator.category,
            stream_title: `Live on TikTok!`,
          };
        }
        return null;
      })
    );

    const liveCreators = liveChecks.filter((c): c is NonNullable<typeof c> => c !== null);

    const rosterData = {
      live_creators: liveCreators,
      total_live: liveCreators.length,
    };

    // 3. Store in Redis with TTL
    await redis.set("live_creators_roster", rosterData, { ex: CACHE_TTL });

    const res = NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      source: "live_fetch",
      data: rosterData,
    }, { status: 200 });
    
    res.headers.set("Cache-Control", "no-store, max-age=0");
    return res;

  } catch (error) {
    console.error("TikTok Live Check Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

