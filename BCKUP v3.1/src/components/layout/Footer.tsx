import Link from "next/link";

const links = [
  { label: "Creators", href: "/#creators" },
  { label: "Services", href: "/#services" },
  { label: "Community", href: "/#community" },
  { label: "FAQ", href: "/#faq" },
];

import { SiteSettings } from "@/lib/creators-db";

export function Footer({ showSocials = true, settings }: { showSocials?: boolean, settings?: SiteSettings['footer'] }) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-foreground-inverse text-xs font-black">P</span>
              </div>
              <span className="text-sm font-bold tracking-tight">
                <span className="text-foreground">Peace Time</span>
                <span className="text-primary"> Agency</span>
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-1">{settings?.tagline || "The elite hub for TikTok LIVE creators."}</p>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-foreground-muted hover:text-foreground transition-colors duration-200 font-medium">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Social + copyright */}
          <div className="flex flex-col items-center md:items-end gap-3">
            {showSocials && settings?.socials && (
              <div className="flex items-center gap-3">
                {settings.socials.filter(s => s.show).map((social) => (
                  <a 
                    key={social.platform}
                    href={social.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-foreground/[0.05] border border-border flex items-center justify-center text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-all duration-200"
                  >
                    {social.platform === 'tiktok' && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
                      </svg>
                    )}
                    {social.platform === 'discord' && (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.033.056a19.906 19.906 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                      </svg>
                    )}
                    {social.platform === 'instagram' && (
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    )}
                    {social.platform === 'twitch' && (
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-2 10l-3 3h-4l-4 4v-4H5V4h14v8z"></path>
                        <path d="M14.5 7h1v3h-1zM11 7h1v3h-1z"></path>
                      </svg>
                    )}
                    {social.platform === 'youtube' && (
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 00-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 001.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 001.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path>
                        <path d="M9.75 15.02l5.75-3.02-5.75-3.02v6.04z"></path>
                      </svg>
                    )}
                    {social.platform === 'website' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            )}
            <p className="text-[11px] text-foreground-subtle">© {new Date().getFullYear()} Peace Time Agency. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
