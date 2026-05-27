import { redis } from './redis';
import { Creator, creators as defaultCreators } from './creators';
import { Article, defaultArticles } from './news';
import fs from 'fs';
import path from 'path';

const CREATORS_REGISTRY_KEY = 'pta:creators_registry'; // Stores array of IDs
const CREATOR_PREFIX = 'pta:creator:';
const REDIS_KEY = 'pta:creators_list'; // Legacy fallback
const SITE_SETTINGS_KEY = 'pta:site_settings';
const NEWS_KEY = 'pta:news_list';
const MOCK_DB_PATH = path.join(process.cwd(), 'mock-db.json');

// Helper to handle local file-based mock DB for dev testing
function getMockDb() {
  if (fs.existsSync(MOCK_DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(MOCK_DB_PATH, 'utf-8'));
    } catch (e) {
      console.error('Error reading mock DB:', e);
    }
  }
  return {};
}

function saveMockDb(data: any) {
  const current = getMockDb();
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify({ ...current, ...data }, null, 2));
}

export async function getCreatorsFromDb(): Promise<Creator[]> {
  const ensurePasswords = (creators: Creator[]) => {
    return creators.map(c => ({
      ...c,
      password: c.password || '1234',
      mediaAssets: c.mediaAssets || []
    }));
  };

  try {
    // 1. Try granular keys first
    const registry = await redis.get<string[]>(CREATORS_REGISTRY_KEY);
    if (registry && Array.isArray(registry)) {
      const creators = await Promise.all(
        registry.map(id => redis.get<Creator>(`${CREATOR_PREFIX}${id}`))
      );
      const validCreators = creators.filter((c): c is Creator => c !== null);
      if (validCreators.length > 0) return ensurePasswords(validCreators);
    }

    // 2. Fallback to legacy single-key if registry empty
    const data = await redis.get<Creator[]>(REDIS_KEY);
    if (data && Array.isArray(data)) {
      return ensurePasswords(data);
    }
    
    // 3. Fallback to file-based mock DB
    const mockDb = getMockDb();
    if (mockDb.creators && Array.isArray(mockDb.creators)) {
      return ensurePasswords(mockDb.creators);
    }
    
    return ensurePasswords(defaultCreators);
  } catch (error) {
    console.error('Error fetching creators from Redis:', error);
    const mockDb = getMockDb();
    const creators = mockDb.creators || defaultCreators;
    return ensurePasswords(creators);
  }
}

export async function saveCreatorsToDb(creators: Creator[]): Promise<boolean> {
  // Update file-based mock
  saveMockDb({ creators });
  
  try {
    // 1. Save registry (IDs)
    const registry = creators.map(c => c.id);
    await redis.set(CREATORS_REGISTRY_KEY, registry);

    // 2. Save each creator granularly
    await Promise.all(
      creators.map(c => redis.set(`${CREATOR_PREFIX}${c.id}`, c))
    );

    // 3. Keep legacy key updated for compatibility during migration
    await redis.set(REDIS_KEY, creators);
    return true;
  } catch (error) {
    console.error('Error saving creators to Redis:', error);
    return false;
  }
}

export async function updateCreatorInDb(updatedCreator: Creator): Promise<boolean> {
  const creators = await getCreatorsFromDb();
  const index = creators.findIndex(c => c.id === updatedCreator.id);
  
  if (index !== -1) {
    creators[index] = updatedCreator;
    return await saveCreatorsToDb(creators);
  }
  
  return false;
}

export async function getNewsFromDb(): Promise<Article[]> {
  try {
    const data = await redis.get<Article[]>(NEWS_KEY);
    if (data && Array.isArray(data)) {
      return data;
    }
    
    // Fallback to file-based mock DB
    const mockDb = getMockDb();
    if (mockDb.news && Array.isArray(mockDb.news)) {
      console.log('Using file-based mock news:', mockDb.news.length);
      return mockDb.news;
    }
    
    return defaultArticles;
  } catch (error) {
    console.error('Error fetching news from Redis:', error);
    const mockDb = getMockDb();
    return mockDb.news || defaultArticles;
  }
}

export async function saveNewsToDb(news: Article[]): Promise<boolean> {
  // Update file-based mock
  console.log('Saving to file-based mock news:', news.length);
  saveMockDb({ news });
  
  try {
    await redis.set(NEWS_KEY, news);
    return true;
  } catch (error) {
    console.error('Error saving news to Redis:', error);
    return false;
  }
}

// Optional utility to seed/reset Redis
export async function resetCreatorsToDefault(): Promise<boolean> {
  return await saveCreatorsToDb(defaultCreators);
}

export interface ApplyFormQuestion {
  id: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  question: string;
  required: boolean;
  options?: string[];
  helpText?: string;
  showIf?: {
    questionId: string;
    equals: string;
  };
}

export interface ApplyPageSettings {
  title: string;
  description: string;
  certificationText: string;
  questions: ApplyFormQuestion[];
}

export interface SiteSettings {
  hero: {
    headlineLine1: string;
    headlineLine2: string;
    subheadline: string;
    stats: { value: string; label: string }[];
  };
  services: {
    index: string;
    title: string;
    description: string;
    accent: string;
    bar: string;
    tag: string;
  }[];
  growthPhases: {
    title: string;
    titleGradient: string;
    description: string;
    tag: string;
    phases: {
      number: string;
      name: string;
      focus: string;
      role: string;
      accent: string;
      border: string;
      bg: string;
      glow: string;
      connector: string;
    }[];
    bottomCallout: string;
  };
  testimonials: {
    tag: string;
    title: string;
    titleGradient: string;
    items: {
      videoSrc: string;
      quote: string;
      creatorName: string;
    }[];
  };
  rosterSettings: {
    mainTag: string;
    mainTitle: string;
    mainTitleAccent: string;
    mainDescription: string;
    sections: {
      liveNow: { title: string; desc: string };
      agencyStaff: { title: string; desc: string };
      topPerforming: { title: string; desc: string };
      newests: { title: string; desc: string };
      allCreators: { title: string; desc: string };
    };
  };
  liveSection: {
    tag: string;
    title: string;
  };
  faqs: {
    q: string;
    a: string;
  }[];
  footer: {
    tagline: string;
    socials: {
      platform: 'tiktok' | 'discord' | 'instagram' | 'youtube' | 'twitch' | 'website';
      url: string;
      show: boolean;
    }[];
  };
  applyPage?: ApplyPageSettings;
}

export const defaultSiteSettings: SiteSettings = {
  hero: {
    headlineLine1: "The Creator Agency",
    headlineLine2: "Built for Streamers.",
    subheadline: "We provide the infrastructure, strategy, and community to help you grow on your own terms. No quotas. No pressure. No predatory contracts.",
    stats: [
      { value: '24/7', label: 'Creator Support System' },
      { value: 'Top Tier', label: 'TikTok LIVE Creator Network' },
      { value: 'Millions', label: 'LIVE Viewers Reached' },
      { value: '147', label: 'Active Members' },
    ]
  },
  services: [
    {
      index: "01",
      title: "Technical & Aesthetic",
      description: "Full-spectrum broadcast optimization. We refine your lighting architecture, camera positioning, and audio processing to maximize viewer retention from the first second.",
      accent: "text-primary",
      bar: "bg-primary",
      tag: "Department",
    },
    {
      index: "02",
      title: "Data-Driven Strategy",
      description: "Algorithmic positioning based on real-time analytics. We optimize your stream hooks and retention loops to capture and hold platform-wide momentum.",
      accent: "text-secondary",
      bar: "bg-secondary",
      tag: "Department",
    },
    {
      index: "03",
      title: "Admin & Account Safety",
      description: "Direct handling of platform policy and account security. We manage ban appeals, flag resolution, and compliance so you can focus exclusively on creation.",
      accent: "text-primary",
      bar: "bg-primary",
      tag: "Department",
    },
    {
      index: "04",
      title: "The Exit Guarantee",
      description: "Total creator autonomy. You retain 100% control over your account. If you choose to leave, we facilitate a clean transition with no hidden restrictions.",
      accent: "text-secondary",
      bar: "bg-secondary",
      tag: "Creator-First",
    },
    {
      index: "05",
      title: "Zero-Pressure Policy",
      description: "No mandatory hours or performance benchmarks. We provide the infrastructure; you decide the pace. Our support remains constant regardless of your streaming volume.",
      accent: "text-primary",
      bar: "bg-primary",
      tag: "Creator-First",
    },
    {
      index: "06",
      title: "Education Center",
      description: "Exclusive access to our private resource library. Over 50+ modules covering advanced TikTok LIVE strategy, technical setup, and community management.",
      accent: "text-secondary",
      bar: "bg-secondary",
      tag: "Onboarding",
    },
  ],
  growthPhases: {
    tag: "Creator Journey",
    title: "Three phases.",
    titleGradient: "One clear path forward.",
    description: "Every creator moves through the same journey. We know exactly how to guide each phase.",
    phases: [
      {
        number: "01",
        name: "Foundation",
        focus: "Tech & Environment",
        role: "The baseline for professional broadcasting. We audit your technical environment to ensure your setup meets the high-fidelity standards required for elite platform push.",
        accent: "text-primary",
        border: "border-primary/30",
        bg: "bg-primary/10",
        glow: "shadow-[0_0_40px_rgba(108,92,231,0.15)]",
        connector: "from-primary/40",
      },
      {
        number: "02",
        name: "Engagement",
        focus: "Algorithmic Reach",
        role: "Transitioning from technical stability to psychological reach. We focus on viewer retention patterns and interaction loops that trigger the platform's distribution algorithm.",
        accent: "text-secondary",
        border: "border-secondary/30",
        bg: "bg-secondary/10",
        glow: "shadow-[0_0_40px_rgba(253,121,168,0.15)]",
        connector: "from-secondary/40",
      },
      {
        number: "03",
        name: "Expansion",
        focus: "Community & Revenue",
        role: "Scaling your influence into a sustainable ecosystem. This phase refines your relationship with your core audience to drive consistent growth and long-term monetization.",
        accent: "text-accent",
        border: "border-accent/30",
        bg: "bg-accent/10",
        glow: "shadow-[0_0_40px_rgba(0,206,201,0.15)]",
        connector: "from-accent/40",
      },
    ],
    bottomCallout: "Growth at your pace. Transparent by design. Built for creators.",
  },
  testimonials: {
    tag: "Proof of Work",
    title: "Hear from our",
    titleGradient: "Creators.",
    items: [],
  },
  rosterSettings: {
    mainTag: "The Network",
    mainTitle: "Our",
    mainTitleAccent: "Creators.",
    mainDescription: "The Peace Time roster is home to the most dedicated, high-growth creators on TikTok LIVE. We provide the infrastructure; they provide the talent.",
    sections: {
      liveNow: { title: "Live Now", desc: "Roster members currently broadcasting." },
      agencyStaff: { title: "Agency Staff", desc: "The leadership driving Peace Time Agency." },
      topPerforming: { title: "Top 5 Performing", desc: "Our highest performing creators." },
      newests: { title: "Peace Time's Newests", desc: "The latest additions to our roster." },
      allCreators: { title: "Peace Time Creators", desc: "The talent of Peace Time Agency." },
    }
  },
  liveSection: {
    tag: "Live Now",
    title: "Elite Creators Broadcasting",
  },
  faqs: [
    {
      q: "What are the expectations and quotas?",
      a: "None. Peace Time operates on a Zero-Pressure Policy: no minimum hours, no gifting benchmarks, and no quotas. We provide the tools; you determine the velocity.",
    },
    {
      q: "How do I join the agency?",
      a: "Submission is handled via TikTok's official agency portal. There are no external legal traps or side-contracts. Once we invite you, everything is finalized securely within the app.",
    },
    {
      q: "Are there any restrictive contracts?",
      a: "Never. We operate exclusively within the official TikTok Agency framework. Transparency is core to our model: no hidden clauses, and no fine print beyond TikTok's standard platform terms.",
    },
    {
      q: "What happens if I decide to leave?",
      a: "You retain full account ownership. You can leave at any time, subject only to TikTok's own platform-mandated 60-day transition window which applies to all agency moves.",
    },
    {
      q: "What does the agency actually do for my stream?",
      a: "We provide professional technical audits, data-driven strategy sessions, and 24/7 administrative support for account safety and platform compliance.",
    },
    {
      q: "What do I get immediately upon joining?",
      a: "Instant access to our 50+ module Education Center, a full technical setup audit, and entry into our private Discord network for strategy and collaboration.",
    },
  ],
  footer: {
    tagline: "The elite hub for TikTok LIVE creators.",
    socials: [
      { platform: 'tiktok', url: '#', show: true },
      { platform: 'discord', url: '#', show: true },
    ]
  },
  applyPage: {
    title: "Creator Intake Form",
    description: "Join Peace Time Agency and level up your TikTok LIVE experience! We're here to support your growth, battles, and experiences in a positive creator network. Please fill out the following questions honestly and completely.",
    certificationText: "I certify that all information provided is accurate and belongs to me.",
    questions: [
      {
        id: "is18Plus",
        type: "radio",
        question: "1. Are you 18 years or older?",
        required: true,
        options: ["Yes", "No"],
        helpText: "Must be 18+ to join and participate in LIVE features.",
      },
      {
        id: "isUSCA",
        type: "radio",
        question: "2. Are you located in the United States or Canada?",
        required: true,
        options: ["Yes", "No"],
        helpText: "Our primary support and features focus on US/CA creators at this time.",
      },
      {
        id: "streamingCountry",
        type: "text",
        question: "What country are you streaming from?",
        required: true,
        showIf: { questionId: "isUSCA", equals: "No" }
      },
      {
        id: "contentTypes",
        type: "checkbox",
        question: "3. What type of content do you make on TikTok LIVE? (Select up to 3)",
        required: true,
        options: [
          "Just Chatting / Casual Talk", "Gaming / Gameplay", "IRL (In Real Life) / Daily Life",
          "Talent Shows / Singing, Dancing, Performances", "Battles / PK / LIVE Matches",
          "Educational / Tutorials / Advice", "Q&A / Fan Interaction", "Other (please specify below)"
        ],
        helpText: "Choose the categories that best describe your LIVE style/content.",
      },
      {
        id: "otherContentType",
        type: "text",
        question: "Please describe your other content type",
        required: true,
        showIf: { questionId: "contentTypes", equals: "Other (please specify below)" }
      },
      {
        id: "nicheDescription",
        type: "textarea",
        question: "4. Please describe your niche/style (e.g. gaming format, IRL vibe, specific talent).",
        required: true,
        helpText: "This helps us understand your vibe and how we can best support you.",
      },
      {
        id: "liveFrequency",
        type: "radio",
        question: "5. How often do you plan to go LIVE per week?",
        required: true,
        options: ["0–2 times", "3–5 times", "6–10 times", "10+ times / Almost daily"],
        helpText: "Consistency helps us plan support and campaigns for you.",
      },
      {
        id: "averageSessionLength",
        type: "radio",
        question: "6. What is your average LIVE session length?",
        required: true,
        options: ["Under 1 hour", "1–2 hours", "2–4 hours", "4+ hours"],
        helpText: "This helps us tailor tips and scheduling advice.",
      },
      {
        id: "streamingDuration",
        type: "radio",
        question: "7. How long have you been streaming on TikTok LIVE?",
        required: true,
        options: ["Less than 1 month", "1 to 3 months", "3 to 6 months", "6 to 12 months", "1+ years"],
      },
      {
        id: "streamingGoals",
        type: "textarea",
        question: "8. What are your goals for streaming?",
        required: true,
        helpText: "(Example: full-time income, growing a community, content creation, gaming career, etc.)",
      },
      {
        id: "improvements",
        type: "checkbox",
        question: "9. What do you want to improve most right now? (Select all that apply)",
        required: true,
        options: ["Growing followers", "Monetization", "Viewer engagement", "Stream setup / overlays", "Content strategy", "Other"],
      },
      {
        id: "otherImprovement",
        type: "text",
        question: "Please specify what else you want to improve",
        required: true,
        showIf: { questionId: "improvements", equals: "Other" }
      },
      {
        id: "followerCount",
        type: "text",
        question: "10. What is your current follower count?",
        required: true,
        helpText: "e.g. 5,000",
      },
      {
        id: "receivesGifts",
        type: "radio",
        question: "11. Do you currently receive gifts on LIVE?",
        required: true,
        options: ["Yes regularly", "Sometimes", "Rarely", "Not yet"],
      },
      {
        id: "biggestChallenge",
        type: "textarea",
        question: "12. What is your biggest challenge with streaming right now?",
        required: true,
      },
      {
        id: "openToCoaching",
        type: "radio",
        question: "13. Are you open to coaching and feedback to grow your streams?",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "otherAgency",
        type: "radio",
        question: "14. Do you currently belong to another TikTok LIVE agency?",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "otherAgencyName",
        type: "text",
        question: "Agency Name",
        required: true,
        showIf: { questionId: "otherAgency", equals: "Yes" }
      },
      {
        id: "tiktokHandle",
        type: "text",
        question: "15. TikTok Username (@)",
        required: true,
        helpText: "Please provide your current main TikTok handle so we can review your profile.",
      },
      {
        id: "discordId",
        type: "text",
        question: "16. Discord ID",
        required: false,
        helpText: "Highly recommended! We use Discord for community chats, updates, training, and quick support.",
      },
      {
        id: "emailAddress",
        type: "text",
        question: "17. Email Address",
        required: false,
      },
      {
        id: "additionalNotes",
        type: "textarea",
        question: "Additional Notes (Optional)",
        required: false,
      }
    ]
  }
};


export async function getSiteSettingsFromDb(): Promise<SiteSettings> {
  try {
    const data = await redis.get<SiteSettings>(SITE_SETTINGS_KEY);
    if (data && data.hero && data.services && data.faqs && data.footer) {
      return data;
    }
    
    // Fallback to file-based mock DB (Mock Mode persistence)
    const mockDb = getMockDb();
    if (mockDb.settings && mockDb.settings.hero) {
      console.log('Using file-based mock site settings');
      return mockDb.settings;
    }

    return defaultSiteSettings;
  } catch (error) {
    console.error('Error fetching site settings from Redis:', error);
    const mockDb = getMockDb();
    return mockDb.settings || defaultSiteSettings;
  }
}

export async function saveSiteSettingsToDb(settings: SiteSettings): Promise<boolean> {
  // Update file-based mock for immediate feedback in dev
  console.log('Saving to file-based mock site settings');
  saveMockDb({ settings });

  try {
    await redis.set(SITE_SETTINGS_KEY, settings);
    return true;
  } catch (error) {
    console.error('Error saving site settings to Redis:', error);
    return false;
  }
}
