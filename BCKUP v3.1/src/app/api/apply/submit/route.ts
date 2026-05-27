import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recruiterId, answers } = body;

    // Master webhook for all applications
    const webhookUrl = "https://discord.com/api/webhooks/1481203208830455890/XKAAcnGVAjbNpcXNWcLU7EvW05e1gx1Jz9CoofZb4NHDqPmd4xkTUrOckEPIQxMaxAm2";

    const fields = [];
    
    // Convert answers object to Discord Embed Fields
    // Discord Embed Fields have a limit of 1024 characters per value and 25 fields total.
    let currentField = { name: "Applicant Responses", value: "" };
    
    if (answers && typeof answers === 'object') {
      for (const [question, answer] of Object.entries(answers)) {
        if (!question || answer === undefined || answer === "") continue;
        
        const answerStr = Array.isArray(answer) ? answer.join(", ") : String(answer);
        const entry = `**${question}**\n${answerStr}\n\n`;
        
        if (currentField.value.length + entry.length > 1000) {
          fields.push({...currentField});
          currentField = { name: "Responses (Cont.)", value: entry };
        } else {
          currentField.value += entry;
        }
      }
    }
    
    if (currentField.value) {
      fields.push(currentField);
    }
    
    if (recruiterId) {
      fields.push({
        name: "🤝 Recruiter",
        value: `Managed by recruiter: **${recruiterId}**`,
      });
    }

    const embed = {
      title: "🚀 New Creator Intake Form Submitted!",
      color: 0xE11D48, // Primary color hex
      description: `A new creator has applied to join **Peace Time Agency**.`,
      fields: fields,
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
      const errorText = await discordResponse.text();
      console.error("Discord Response details:", errorText);
      throw new Error(`Discord Webhook failed with status ${discordResponse.status}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json(
      { error: "Failed to submit application. Please try again later." },
      { status: 500 }
    );
  }
}
