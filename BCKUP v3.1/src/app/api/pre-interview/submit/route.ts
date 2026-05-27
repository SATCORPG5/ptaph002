import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, tiktok, email, discordId } = body;

    // Discord Webhook for Pre-Interview Requests
    const webhookUrl = "https://discord.com/api/webhooks/1481204206307250220/UvzLEBPPQd9oBBHpzwAnQ6uBzAN599WKb11zBEk968OiVoACm5YKU2CNkvegL0onvrgb";

    const embed = {
      title: "👀 New Pre-Interview Request!",
      color: 0xE11D48, // Primary color hex
      description: `A creator has requested a pre-interview discussion with **Peace Time Agency**.`,
      fields: [
        {
          name: "👤 Candidate",
          value: `**Name:** ${name}\n**TikTok Handle:** ${tiktok}`,
          inline: false
        },
        {
          name: "📞 Contact Details",
          value: `**Discord ID:** ${discordId}\n**Email:** ${email}`,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Peace Time Agency • Talent Intake System",
      }
    };

    const discordPayload = {
      embeds: [embed]
    };

    // Send the POST request to the Discord Webhook
    const discordResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordPayload),
    });

    if (!discordResponse.ok) {
      console.error("Discord Webhook Error:", discordResponse.status, discordResponse.statusText);
      throw new Error(`Discord Webhook failed with status ${discordResponse.status}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to submit request." },
      { status: 500 }
    );
  }
}
