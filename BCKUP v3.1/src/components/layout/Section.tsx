"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { HTMLMotionProps } from "framer-motion";

interface SectionProps extends HTMLMotionProps<"section"> {
  container?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, container = true, ...props }, ref) => {
    return (
      <motion.section 
        ref={ref} 
        className={cn("py-12 md:py-16 lg:py-24", className)} 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        {...props}
      >
        {container ? (
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
            {props.children as React.ReactNode}
          </div>
        ) : (
          props.children as React.ReactNode
        )}
      </motion.section>
    );
  }
);
Section.displayName = "Section";
