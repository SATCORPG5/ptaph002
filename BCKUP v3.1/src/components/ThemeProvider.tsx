"use client";

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" {...props}>
      {children}
    </NextThemesProvider>
  );
}
