import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL = "https://discord.com/api/webhooks/1481041834859036867/NQ4Fi-Li9yoOX2U1kWCdwzlA_5rF_xXScxUntTKpOmE69UMFOIrCCPrlaX839tD8G1eE";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      displayName,
      bio,
      tiktokHandle,
      tiktokLiveLink,
      categories,
      affiliation,
      selectedPlatforms,
      socialDetails,
      mediaLinks,
    } = body;

    // Formatting social links
    let socialLinksString = "None";
    if (selectedPlatforms && selectedPlatforms.length > 0) {
      socialLinksString = selectedPlatforms.map((p: string) => {
        const detail = socialDetails[p];
        const platformName = p.toUpperCase();
        const label = detail.label ? ` (${detail.label})` : "";
        const usernameStr = detail.username ? ` ${detail.username}` : "";
        const linkStr = detail.link ? ` - [Link](${detail.link})` : "";
        
        return `**${platformName}${label}:**${usernameStr}${linkStr}`;
      }).join("\n");
    }

    const embed = {
      title: "🪪 New Creator Card Request!",
      color: 0xFF3C5F, // PTA Primary Coral/Rose
      description: `**${displayName}** has submitted their information for a Creator Card.`,
      fields: [
        {
          name: "👤 Core Info",
          value: `**Display Name:** ${displayName}\n**Affiliation:** ${affiliation}\n**TikTok:** [@${tiktokHandle}](https://tiktok.com/@${tiktokHandle})\n**Live Link:** [View Live](${tiktokLiveLink})`,
          inline: false
        },
        {
          name: "📝 Bio",
          value: bio || "No bio provided.",
          inline: false
        },
        {
          name: "🏷️ Categories",
          value: categories.join(", ") || "None selected",
          inline: true
        },
        {
          name: "🔗 Social Links",
          value: socialLinksString,
          inline: false
        },
        {
          name: "🖼️ Media Uploads",
          value: mediaLinks || "No photo links provided. (Check Discord for video DMs)",
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Peace Time Agency • Creator Card System",
      }
    };

    const discordPayload = {
      embeds: [embed]
    };

    const discordResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      console.error("Discord Webhook Error:", discordResponse.status);
      throw new Error(`Discord Webhook failed with status ${discordResponse.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}
