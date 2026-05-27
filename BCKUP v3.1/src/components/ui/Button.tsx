import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",

          // Variants
          {
            "bg-primary text-foreground-inverse hover:bg-primary-dark": variant === "primary",
            "bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30": variant === "secondary",
            "border border-border bg-transparent hover:bg-white/[0.04] hover:border-foreground-muted text-foreground-muted hover:text-foreground": variant === "outline",
            "hover:bg-white/[0.04] text-foreground-muted hover:text-foreground": variant === "ghost",
          },

          // Glow
          {
            "hover:shadow-neon-primary": glow && variant === "primary",
            "hover:shadow-neon-secondary": glow && variant === "secondary",
          },

          // Sizes
          {
            "h-9 px-4 text-xs": size === "sm",
            "h-10 px-5 py-2": size === "md",
            "h-12 px-8 py-3": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
