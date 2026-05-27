import type { Metadata } from "next";
import { Outfit, Space_Grotesk, Michroma } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Peace Time Agency | The Elite Hub for TikTok LIVE Creators",
  description: "Elevating streams with high production, strategy, campaigns, and the Creator Growth System.",
};

import { Navigation } from "@/components/layout/Navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} ${michroma.variable} antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-50 transition-colors duration-700`}>
        <ThemeProvider>
          <Navigation />
          <div className="pt-16">
            {children}
          </div>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || "https://analytics.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
