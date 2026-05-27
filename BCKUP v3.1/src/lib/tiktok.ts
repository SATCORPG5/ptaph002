/**
 * TikTok API Utility Library
 * Handles OAuth 2.0 flow and user profile fetching.
 * Includes a Mock Mode for development.
 */

const TIKTOK_CLIENT_ID = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID || "mock_client_id";
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "mock_client_secret";
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/tiktok/callback`
  : "http://localhost:3000/api/auth/tiktok/callback";

const MOCK_MODE = process.env.MOCK_TIKTOK === "true" || !process.env.TIKTOK_CLIENT_SECRET;

export interface TikTokProfile {
  open_id: string;
  union_id: string;
  avatar_url: string;
  display_name: string;
  username: string;
  follower_count?: number;
  likes_count?: number;
  latest_video_cover?: string;
}

export function getTikTokAuthUrl(state: string) {
  if (MOCK_MODE) {
    return `/api/auth/tiktok/callback?code=mock_code&state=${state}`;
  }

  const scope = "user.info.profile,user.info.stats,video.list";
  const url = new URL("https://www.tiktok.com/v2/auth/authorize/");
  url.searchParams.append("client_key", TIKTOK_CLIENT_ID);
  url.searchParams.append("scope", scope);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("redirect_uri", REDIRECT_URI);
  url.searchParams.append("state", state);
  
  return url.toString();
}

export async function exchangeTikTokCode(code: string) {
  if (MOCK_MODE) {
    return {
      access_token: "mock_access_token",
      open_id: "mock_open_id",
      expires_in: 86400,
    };
  }

  const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_key: TIKTOK_CLIENT_ID,
      client_secret: TIKTOK_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error_description || "Failed to exchange TikTok code");
  }

  return response.json();
}

export async function getTikTokProfile(accessToken: string): Promise<TikTokProfile> {
  if (MOCK_MODE) {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    return {
      open_id: "mock_open_id",
      union_id: "mock_union_id",
      avatar_url: "https://images.unsplash.com/photo-153571501002f-bc5a2d79119a?q=80&w=100&h=100&auto=format&fit=crop",
      display_name: "Mock Creator",
      username: "mock_creator_66",
      follower_count: 54200,
      likes_count: 1250000,
      latest_video_cover: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=200&h=300&auto=format&fit=crop",
    };
  }

  const response = await fetch("https://open.tiktokapis.com/v2/user/info/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch TikTok profile");
  }

  const { data } = await response.json();
  return {
    ...data.user,
    follower_count: data.user.follower_count, // TikTok API structure varies, mapping here
    likes_count: data.user.likes_count,
  };
}

/**
 * Checks if a TikTok user is currently live by scraping their live page.
 * This is an unofficial method used when official API access is limited.
 */
export async function fetchTikTokLiveStatus(handle: string) {
  const username = handle.startsWith('@') ? handle.slice(1) : handle;
  const url = `https://www.tiktok.com/@${username}/live`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      next: { revalidate: 0 } // Disable Next.js fetch cache
    });

    if (!response.ok) return { isLive: false, viewerCount: 0 };

    const html = await response.text();
    
    // Check for common indicators of a live stream in the HTML
    // TikTok often includes "RENDER_DATA" or specific live meta tags
    // FORCE DISABLED: Returning false per user request until a more robust scraping/API fix is implemented.
    const isLive = false; 
    /*
    const isLive = html.includes('"liveRoom":') || 
                   html.includes('"status":2'); // 2 usually means live
    */

    // Attempt to extract viewer count (highly variable, using a loose regex)
    let viewerCount = 0;
    const viewerMatch = html.match(/"userCount":(\d+)/) || html.match(/"viewerCount":(\d+)/);
    if (viewerMatch) {
      viewerCount = parseInt(viewerMatch[1], 10);
    }

    return { isLive, viewerCount };
  } catch (error) {
    console.error(`Error checking live status for ${username}:`, error);
    return { isLive: false, viewerCount: 0 };
  }
}
