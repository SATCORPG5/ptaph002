"use client";

import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function SkeletonCard({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "glass-card animate-pulse shadow-card rounded-2xl overflow-hidden min-h-[400px] flex flex-col p-6",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start mb-6 w-full">
        <div className="h-4 w-12 bg-white/5 rounded-full" />
        <div className="h-5 w-24 bg-white/5 rounded-full" />
      </div>

      <div className="mt-auto space-y-4">
        <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
        <div className="h-4 w-full bg-white/5 rounded" />
        <div className="h-4 w-5/6 bg-white/5 rounded" />
        
        <div className="pt-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/10" />
          <div className="h-4 w-24 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}
