"use client";

import { Info } from "lucide-react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}

export function FormField({ label, children, hint, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-foreground-subtle ml-1 block">{label}</label>
      {children}
      {hint && (
        <div className="flex items-center gap-1.5 ml-1 mt-1 opacity-40">
          <Info className="w-2.5 h-2.5" />
          <span className="text-[8px] font-bold uppercase tracking-widest leading-none">{hint}</span>
        </div>
      )}
      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-1 animate-pulse">{error}</p>
      )}
    </div>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all ${props.className || ""}`}
    />
  );
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/60 transition-all resize-none leading-relaxed ${props.className || ""}`}
    />
  );
}

export function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full bg-[#121826] border border-white/10 rounded-2xl px-5 py-3 text-white font-black uppercase tracking-widest text-xs focus:outline-none focus:ring-1 focus:ring-primary/60 appearance-none cursor-pointer ${props.className || ""}`}
      />
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <div className="w-1.5 h-1.5 border-r border-b border-white rotate-45" />
      </div>
    </div>
  );
}

export function FormSection({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        {Icon ? <Icon className="w-4 h-4 text-primary" /> : <div className="w-1.5 h-6 bg-primary rounded-full" />}
        <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs leading-none">{title}</h3>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
