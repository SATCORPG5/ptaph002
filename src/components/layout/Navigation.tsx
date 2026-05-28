'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { getSession, signOutAction } from "@/app/actions/auth";
import { Creator } from "@/lib/creators";

function getPortalUrl(creator: Creator): string {
  if (creator.tier === 'staff' || (creator as any).role === 'admin') return '/portal/admin';
  if (creator.tier === 'recruiter') return '/portal/my-creators';
  return '/portal/home';
}

const NAV_LINKS = [
  { name: "Creators", href: "/creators" },
  { name: "News", href: "/news" },
  { name: "Recruiters", href: "/recruiters" },
  { name: "FAQ", href: "/#faq" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Creator | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isCardForm = pathname === "/cardform";
  const isPortal = pathname.startsWith('/portal');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    async function fetchSession() {
      const user = await getSession();
      setSession(user);
    }
    fetchSession();
  }, [pathname]);

  const handleSignOut = async () => {
    await signOutAction();
    setSession(null);
    router.refresh();
    router.push('/creators');
  };

  if (isPortal) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-[#01020A]/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          : "bg-[#01020A]/20 backdrop-blur-[2px] border-b border-transparent"
          }`}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo & Portal Buttons */}
          {!isCardForm ? (
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center group">
                <span className="text-2xl font-black tracking-tighter font-display" style={{ textShadow: '0 0 1px rgba(0,0,0,0.8)' }}>
                  <span style={{ color: '#FFFFFF' }}>Peace Time</span>
                  <span className="text-primary"> Agency</span>
                </span>
              </Link>

              {session && (
                <div className="hidden sm:flex items-center gap-2 pl-6 border-l border-white/10">
  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="text-white/40 hover:text-red-400 hover:bg-red-400/5 font-bold"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* Desktop Nav */}
          {!isCardForm && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-white/[0.08] transition-all duration-200"
                  style={{ color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.1)' }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}

          {/* CTA */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {!isCardForm && (
              <>
                {!session ? null : (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[10px] font-bold text-white/60 tracking-wider uppercase">{session.handle}</span>
                  </div>
                )}

                <Link href="/apply"><Button className="hidden sm:inline-flex rounded-lg px-5 h-9 font-semibold text-sm bg-primary hover:bg-primary-dark text-white transition-all duration-200 hover:shadow-neon-primary">Join the Roster</Button></Link>
                {session ? (
                  <Link href={getPortalUrl(session)}>
                    <Button className="hidden sm:inline-flex rounded-lg px-5 h-9 font-semibold text-sm bg-portal-accent hover:bg-[#0ea5e9] text-white transition-all duration-200">
                      My Portal
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button className="hidden sm:inline-flex rounded-lg px-5 h-9 font-semibold text-sm bg-purple-600 hover:bg-purple-500 text-white transition-all duration-200">Creator Portal</Button>
                  </Link>
                )}

                {/* Mobile Menu */}
                <button
                  className="md:hidden p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {!isCardForm && mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-[#0F1623]/95 backdrop-blur-xl border-b border-white/[0.06]"
            >
              <nav className="flex flex-col px-4 py-4 gap-2">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold rounded-lg hover:bg-white/[0.08] transition-all duration-200"
                    style={{ color: '#FFFFFF' }}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-2 pb-1 border-t border-white/[0.06] mt-2 flex flex-col gap-2">
                  <Link href="/apply" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-lg h-10 font-semibold text-sm bg-primary hover:bg-primary-dark text-white transition-all duration-200">
                      Join the Roster
                    </Button>
                  </Link>
                  {session ? (
                    <Link href={getPortalUrl(session)} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-lg h-10 font-semibold text-sm bg-portal-accent hover:bg-[#0ea5e9] text-white transition-all duration-200">
                        My Portal
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-lg h-10 font-semibold text-sm bg-purple-600 hover:bg-purple-500 text-white transition-all duration-200">
                        Creator Portal
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

    </>
  );
}
