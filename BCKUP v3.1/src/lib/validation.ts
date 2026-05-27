import { z } from "zod";

export const CreatorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string(),
  image: z.string().url("Invalid image URL").or(z.string().regex(/^\/.*$/, "Must be a relative path")),
  socials: z.object({
    tiktok: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    twitch: z.string().optional(),
    twitter: z.string().optional(),
  }),
  category: z.enum(["livenow", "staff", "top5", "newests", "all"]),
  liveUrl: z.string().url().optional().or(z.literal("")),
  bio: z.string().optional(),
  backgroundUrl: z.string().url("Invalid background URL").or(z.string().regex(/^\/.*$/, "Must be a relative path")).optional(),
  backgroundContrast: z.number().min(0).max(100).optional(),
});

export const ApplyFormQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["text", "textarea", "radio", "checkbox", "select"]),
  question: z.string(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  helpText: z.string().optional(),
  showIf: z.object({
    questionId: z.string(),
    equals: z.string()
  }).optional(),
});

export const ApplyPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  certificationText: z.string(),
  questions: z.array(ApplyFormQuestionSchema),
});


export const ArticleSchema = z.object({
  title: z.string().min(5, "Title too short"),
  slug: z.string().min(5),
  date: z.string(),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  image: z.string().url().or(z.string().regex(/^\/.*$/)),
  category: z.string(),
  readTime: z.string(),
});

export const SiteSettingsSchema = z.object({
  hero: z.object({
    headlineLine1: z.string(),
    headlineLine2: z.string(),
    subheadline: z.string(),
    stats: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })),
  }),
  services: z.array(z.object({
    index: z.string(),
    title: z.string(),
    description: z.string(),
    accent: z.string(),
    bar: z.string(),
    tag: z.string(),
  })),
  growthPhases: z.object({
    tag: z.string(),
    title: z.string(),
    titleGradient: z.string(),
    description: z.string(),
    phases: z.array(z.object({
      number: z.string(),
      name: z.string(),
      focus: z.string(),
      role: z.string(),
      accent: z.string(),
      border: z.string(),
      bg: z.string(),
      glow: z.string(),
      connector: z.string(),
    })),
    bottomCallout: z.string(),
  }),
  testimonials: z.object({
    tag: z.string(),
    title: z.string(),
    titleGradient: z.string(),
    items: z.array(z.object({
      videoSrc: z.string(),
      quote: z.string(),
      creatorName: z.string(),
    })),
  }),
  rosterSettings: z.object({
    mainTag: z.string(),
    mainTitle: z.string(),
    mainTitleAccent: z.string(),
    mainDescription: z.string(),
    sections: z.record(z.string(), z.object({
      title: z.string(),
      desc: z.string(),
    })),
  }),
  liveSection: z.object({
    tag: z.string(),
    title: z.string(),
  }),
  faqs: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })),
  footer: z.object({
    tagline: z.string(),
    socials: z.array(z.object({
      platform: z.enum(['tiktok', 'discord', 'instagram', 'youtube', 'twitch', 'website']),
      url: z.string(),
      show: z.boolean(),
    })),
  }),
  applyPage: ApplyPageSchema.optional(),
});
