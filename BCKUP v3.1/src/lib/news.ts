export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  author: string;
}

export const defaultArticles: Article[] = [
  {
    slug: "redefining-creator-revenue",
    title: "Redefining Creator Revenue: The PTA Growth System",
    excerpt: "How our proprietary analytics engine helped a mid-tier creator scale from $2k to $25k in monthly live revenue.",
    date: "March 15, 2026",
    category: "Case Study",
    image: "https://images.unsplash.com/photo-1551288049-bbda38a594a0?q=80&w=800&auto=format&fit=crop",
    author: "Agency Principal"
  },
  {
    slug: "future-of-tiktok-live",
    title: "The Future of TikTok LIVE in 2026",
    excerpt: "Insights from the latest platform algorithm updates and how we're positioning our creators for the next wave of growth.",
    date: "March 10, 2026",
    category: "Insights",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
    author: "Strategy Lead"
  },
  {
    slug: "community-first-infrastructure",
    title: "Building Community-First Infrastructure",
    excerpt: "Why the PTA Discord isn't just a chatroom, but a tactical war room for creator success and cross-promotion.",
    date: "March 05, 2026",
    category: "Community",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    author: "Community Director"
  }
];

export const articles = defaultArticles;
