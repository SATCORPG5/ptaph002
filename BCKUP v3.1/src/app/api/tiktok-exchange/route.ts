import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    const { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI } = process.env;

    if (!TIKTOK_CLIENT_KEY || !TIKTOK_CLIENT_SECRET || !TIKTOK_REDIRECT_URI) {
      console.error("Missing TikTok environment variables. Required: TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI");
      return NextResponse.json(
        { error: "Server Configuration Error" },
        { status: 500 }
      );
    }

    // 1. Exchange the code for an Access Token
    // Documented in TikTok Login Kit v2
    const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";
    const tokenBody = new URLSearchParams({
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: TIKTOK_REDIRECT_URI,
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
      body: tokenBody.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      console.error("TikTok Token Error:", tokenData);
      return NextResponse.json(
        { error: "Failed to exchange authorization code", details: tokenData.error_description || tokenData.error },
        { status: 401 }
      );
    }

    const { access_token, refresh_token, open_id } = tokenData;

    // 2. Fetch User Profile Info and Stats using the Access Token
    // Requesting stats and basic profile info
    const fields = "open_id,union_id,avatar_url,display_name,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count";
    const userUrl = `https://open.tiktokapis.com/v2/user/info/?fields=${fields}`;

    const userResponse = await fetch(userUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (userData.error?.code !== 0 || !userData.data) {
      console.error("TikTok User Info Error:", userData);
      return NextResponse.json(
        { error: "Failed to fetch user data from TikTok", details: userData.error },
        { status: 400 }
      );
    }

    // In a production app, you would typically save the user data and refresh_token
    // to your database (e.g. Postgres, MongoDB) right here.
    
    return NextResponse.json({
      success: true,
      user_info: userData.data.user,
      tokens: {
        access_token,
        refresh_token,
        open_id,
        expires_in: tokenData.expires_in,
        refresh_expires_in: tokenData.refresh_expires_in
      }
    });

  } catch (error) {
    console.error("API Route Error (TikTok Exchange):", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
