"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, AlertCircle } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
  maxWidth?: string;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  onSave,
  saving,
  saveLabel = "Commit Changes",
  maxWidth = "max-w-5xl",
}: AdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`relative w-full ${maxWidth} h-full max-h-[85vh] bg-[#0A0F1A] border border-white/10 rounded-[40px] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden`}
          >
            <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-dot-grid opacity-10 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 leading-none">
                  <Save className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-white uppercase">{title}</h2>
                  {subtitle && (
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground-muted">{subtitle}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors group"
              >
                <X className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-10 relative z-10 scrollbar-thin">
              {children}
            </div>

            {/* Footer */}
            <div className="relative z-10 p-8 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
              {footer ? (
                footer
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black text-foreground-subtle">
                      {saving ? "Processing Commit..." : "Awaiting Authorization"}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all"
                    >
                      Abort / Discard
                    </button>
                    {onSave && (
                      <button
                        onClick={onSave}
                        disabled={saving}
                        className="group relative h-12 px-10 bg-gradient-to-r from-secondary to-secondary-dark rounded-2xl flex items-center gap-2 overflow-hidden transition-all shadow-neon-secondary/20 hover:shadow-neon-secondary/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white relative z-10" />
                            <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 text-white relative z-10" />
                            <span className="text-white text-xs font-black uppercase tracking-widest relative z-10">{saveLabel}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
