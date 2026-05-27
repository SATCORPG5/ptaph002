export interface CreatorStats {
  followers: string;
  avgWatchTime: string;
  peakCCV: string;
  totalLikes: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  title?: string;
  description: string;
  image: string;
  category: string[];
  stats: CreatorStats;
  tags: string[];
  tier?: 'staff' | 'top' | 'new' | 'recruiter';
  webhookUrl?: string;
  liveUrl?: string;
  images?: string[];
  accentColor?: string;
  socials: {
    tiktok: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    discord?: string;
    twitch?: string;
    steam?: string;
    website?: string;
    x?: string;
    threads?: string;
    facebook?: string;
  };
  password?: string;
  mediaAssets?: string[];
  backgroundUrl?: string;
  backgroundContrast?: number;
  // New Fields
  embeds?: {
    youtube?: string;
    spotify?: string;
    tiktok?: string;
  };
  customization?: {
    fontFamily?: string;
    bgAnimation?: 'none' | 'stars' | 'bubbles' | 'waves';
    themeColor?: string;
  };
  automation?: {
    youtubeChannelId?: string;
    instagramUsername?: string;
    autoUpdateContent?: boolean;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  customLinks?: {
    label: string;
    url: string;
  }[];
  countdown?: {
    targetDate?: string;
    label?: string;
  };
  abTest?: {
    enabled?: boolean;
    altBio?: string;
    altImage?: string;
  };
}

export const creators: Creator[] = [
  {
    id: "baked",
    name: "Baked",
    handle: "@baked.laze",
    title: "Founder",
    description: "Hi, I’m Nick, founder of Peace Time Agency. I work directly with creators to help them grow on TikTok LIVE through stream strategy, setup guidance, and community support. My goal is simple, help creators stay consistent, improve their content, and turn streaming into real opportunity.",
    image: "/creators/baked.jpg",
    category: ["Staff", "Gaming"],
    stats: {
      followers: "N/A",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Staff", "Gaming"],
    tier: "staff",
    liveUrl: "https://www.tiktok.com/@baked.laze/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@baked.laze"
    }
  },
  {
    id: "coldp1zza",
    name: "ColdP1zza",
    handle: "@coldp1zza",
    description: "Boy dad • Husband • FPS & RPG/RPGMMO gamer • Full-time worker • Streaming when I can 🍕🎮",
    image: "/branding/KYRAX425.png",
    category: ["Gaming"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming", "FPS", "RPG", "MMO"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@coldp1zza/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@coldp1zza",
      twitch: "https://www.twitch.tv/ColdP1zza",
      twitter: "https://x.com/CP1zza",
      website: "https://kick.com/ColdP1zza"
    }
  },
  {
    id: "slingin6_0",
    name: "Slingin6.0",
    handle: "@macdaddy6.0",
    description: "I like streaming and having fun doing it",
    image: "/branding/KYRAX425.png",
    category: ["Gaming"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@macdaddy6.0/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@macdaddy6.0",
      twitch: "https://www.twitch.tv/slingin6"
    }
  },
  {
    id: "oopsitsjrpgtime",
    name: "OopsItsJRPGTime",
    handle: "@oopsitsjrpgtime",
    description: "Hello there my name is OopsItsJRPGTime or \"Oops\" for short! If I were to have to describe myself as a vibe it would have to be \"Chill.\" I stream mostly JRPG Games from classic to new and anywhere in between! I first fell in love with Jrpg games back on the SNES with my very first game ever Breath of Fire and from then on I was hooked! My goal for streaming has always been to make amazing friends, so will you be my friend?!",
    image: "/creators/oopsitsjrpgtime.jpg",
    category: ["Gaming"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming", "JRPGs", "Classic"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@oopsitsjrpgtime/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@oopsitsjrpgtime",
      twitch: "https://www.twitch.tv/oopsitsjrpgtime",
      youtube: "https://www.youtube.com/@OopsItsJRPGTIME",
      discord: "https://discordapp.com/users/oopsitsjrpgtime",
      steam: "https://steamcommunity.com/id/OopsItsJRPGTIME",
      website: "https://www.oopsitsjrpgtime.com/"
    }
  },
  {
    id: "mrleftythehand",
    name: "Mr. Lefty the Hand",
    handle: "@mrleftythehand",
    description: "I’m Mr. Lefty, a hand that somehow ended up flying planes, driving tanks, and making questionable tactical decisions in War Thunder. Whether it’s clutch moments, terrible aim, or Gaijin doing Gaijin things, Lefty’s here for random bits of chaos along the way.",
    image: "/creators/mrleftythehand.jpg",
    category: ["Gaming"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming", "War Thunder", "Tanks", "Planes"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@mrleftythehand/live",
    images: [
      "/creators/mrleftythehand.jpg",
      "/creators/mrleftythehand_tank.png",
      "/creators/mrleftythehand_plane.png"
    ],
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@mrleftythehand",
      twitch: "https://www.twitch.tv/mrleftythehand"
    }
  },
  {
    id: "trashsoupgaming",
    name: "Trash (aka Lindsey)",
    handle: "@trashsoupgaming",
    description: "Lindsey, also known as Trash (@TrashSoupGaming), is a full-time TikTok streamer who focuses on story-driven games like RPGs and well-written horror. Over time, she has built a strong, loyal community that doesn’t just show up for the games, but for the conversations, reactions, and shared experiences that happen during every stream. Lindsey believes that growth on TikTok LIVE isn’t just about numbers. It’s about building a space where people want to come back, where viewers feel part of something, and where creators can develop confidence in what they’re doing. For Lindsey, streaming isn’t just about going live. It’s about helping others find their place and grow along the way.",
    image: "/creators/IMG_5799.JPG",
    category: ["Staff", "Gaming", "Just Chatting"],
    title: "Education Center Manager/Recruiter",

    stats: {
      followers: "Full-time",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Staff", "Gaming", "RPG", "Horror", "Just Chatting"],
    tier: "recruiter",
    liveUrl: "https://www.tiktok.com/@trashsoupgaming/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@trashsoupgaming",
      youtube: "https://www.youtube.com/@trashsoupgaming",
      website: "https://trashsoup.live/"
    }
  },
  {
    id: "papaj",
    name: "Papa J",
    handle: "@papa.j547",
    description: "Just a gamer from Wyoming. I've been gaming since the Atari 2600 lol. Mostly I stream War Thunder but will occasionally change it up with something different.",
    image: "/branding/KYRAX425.png",
    category: ["Gaming", "Just Chatting", "IRL"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming", "Just Chatting", "IRL", "War Thunder", "Wyoming"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@papa.j547/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@papa.j547",
      twitch: "https://www.twitch.tv/Gaming_With_Papa_J",
      discord: "https://discordapp.com/users/pwnll307"
    }
  },
  {
    id: "itsjakee_78",
    name: "ItsJakee_78",
    handle: "@itsjakee_78",
    description: "I’m a gaming creator posting Warzone gameplay, gaming memes, and fun squad moments.",
    image: "/creators/image.png",
    category: ["Gaming"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming", "Warzone", "Memes", "Squad"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@itsjakee_78/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@itsjakee_78",
      twitch: "https://m.twitch.tv/itsjakee_78",
      youtube: "https://m.youtube.com/@ItsJakee_78",
      instagram: "https://www.instagram.com/itsjakee_78?igsh=MWl5anRybnh6aXZlaQ%3D%3D&utm_source=qr",
      website: "https://kick.com/itsjakee-78"
    }
  },
  {
    id: "thej3ssexpress",
    name: "Jessica",
    handle: "@TheJ3ssExpress",
    title: "Creator Retention Manager/Recruiter",
    description: "Hey! I’m Jessica, aka TheJ3ssExpress. I’m a recruiter and The Creator Retention Manager with Peacetime, where I help support and grow creators on TikTok. Seeing creators succeed is something I’m really passionate about.\n\nOn my own streams, you’ll usually find me cozy gaming while jamming to some rock or EDM. Every now and then I’ll dive into a horror game and suffer through a few jumpscares. I also like to pop in with occasional IRL lives whether it’s just chatting or a “cook dinner with me” stream.",
    image: "/creators/564674.jpg",
    category: ["Gaming", "Just Chatting", "IRL", "Recruiter"],
    stats: {
      followers: "N/A",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Staff", "Recruiter", "Gaming", "Just Chatting", "IRL"],
    tier: "recruiter",
    liveUrl: "https://www.tiktok.com/@TheJ3ssExpress/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@TheJ3ssExpress"
    }
  },
  {
    id: "generalspuds",
    name: "General Spuds",
    handle: "@generalspuds",
    title: "Virtual Training/Recruiter",
    description: "HI! I am general Spuds. I have been creating for years and play a variety of games from FPS to RPGS. I enjoy creating a positive environment and inspiring the people I meet. Rather I am streaming or helping another creator, I love lifting people up. Positive times and Vibes",
    image: "/creators/generalspuds.jpg",
    category: ["Gaming", "Just Chatting", "IRL", "Staff"],
    stats: {
      followers: "N/A",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Staff", "Gaming", "Just Chatting", "IRL"],
    tier: "recruiter",
    liveUrl: "https://www.tiktok.com/@generalspuds",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@generalspuds",
      instagram: "https://www.instagram.com/generalspuds",
      twitch: "https://www.twitch.tv/generalspudss",
      youtube: "https://www.youtube.com/channel/UCClmICi4Ga9r-72ylBxoxlg"
    }
  },
  {
    id: "stealyn",
    name: "STEALYN",
    handle: "@stealyn.vr",
    title: "Algorithm Coach/Recruiter",
    description: "The Content Coach with no fluff, Stealyn believes great creators are built through knowledge, positivity, and mental fortitude. He is a War Thunder VR creator by passion and a blue-collar worker by trade; he knows the value of discipline, balance, and consistency. Here at PeaceTime, his focus is to build strategies around YOUR success as an individual creator! He’s not looking for just anybody; he’s looking for those ready to earn their place as an Agent of PeaceTime.",
    image: "/creators/672FF5B8-54C4-4B6B-8626-006254F314E1.jpg",
    images: [],
    category: ["Gaming", "Recruiter"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Staff", "Gaming", "War Thunder VR", "Coach"],
    tier: "recruiter",
    liveUrl: "https://www.tiktok.com/@stealyn.vr/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@stealyn.vr",
      discord: "https://discord.gg/UajNn4KaQP"
    }
  },
  {
    id: "internettourguide",
    name: "Internet Tour Guide",
    handle: "@internettourguide",
    description: "Internet Tour Guide is a creator with rare range: live energy, real audience interaction, and genuinely high-production content off-stream, all backed by the discipline to build both a personal brand and a daily content business for small business owners that don't want to become influencers to survive. Take the Tour :v:",
    image: "/creators/internettourguide.png",
    images: [
      "/creators/internettourguide.png",
      "/creators/internettourguide_moody.jpg",
      "/creators/internettourguide_banner_1.png",
      "/creators/internettourguide_banner_2.png"
    ],
    category: ["Gaming", "Just Chatting", "IRL", "Comedy", "Skits"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming", "Just Chatting", "IRL", "Comedy", "Skits", "Small Business"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@internettourguide/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@internettourguide",
      youtube: "https://www.youtube.com/@colethetourguide",
      discord: "https://discord.gg/T2bsJapnfC",
      instagram: "https://www.instagram.com/internettourguide/",
      website: "https://internettour.guide/"
    }
  },
  {
    id: "morbidsunscheduledovertime",
    name: "Morbid's Unscheduled Overtime",
    handle: "@ass_ass_inn",
    description: "I work in industrial maintenance, but I'm also a multistreamer, I like to try multiple games and genre's, and I typically play with viewers!",
    image: "/branding/KYRAX425.png",
    category: ["Gaming"],
    stats: {
      followers: "New",
      avgWatchTime: "N/A",
      peakCCV: "N/A",
      totalLikes: "0"
    },
    tags: ["Gaming", "Industrial Maintenance", "Multistreamer"],
    tier: "new",
    liveUrl: "https://www.tiktok.com/@ass_ass_inn/live",
    password: "1234",
    mediaAssets: [],
    socials: {
      tiktok: "https://www.tiktok.com/@ass_ass_inn?_r=1&_t=ZP-95C20p6kOHG",
      twitch: "https://m.twitch.tv/morbidunscheduledovertime/home",
      discord: "https://discordapp.com/users/Morbid1454"
    }
  }
];
