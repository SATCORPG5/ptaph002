"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";

interface AdminConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  variant?: "danger" | "warning";
}

export function AdminConfirm({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm Action",
  loading = false,
  variant = "danger",
}: AdminConfirmProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0D1117] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className={`h-1.5 w-full ${variant === "danger" ? "bg-red-500" : "bg-accent"}`} />
            
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${variant === "danger" ? "bg-red-500/10" : "bg-accent/10"}`}>
                  <AlertTriangle className={`w-6 h-6 ${variant === "danger" ? "text-red-500" : "text-accent"}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">{title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">{message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`flex-1 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                    variant === "danger" 
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-accent hover:bg-accent-dark text-black"
                  }`}
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
