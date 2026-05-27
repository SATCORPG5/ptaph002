"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface EditableListProps<T> {
  items: T[];
  onAdd: () => void;
  onDelete: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
  title?: string;
  icon?: React.ReactNode;
  emptyLabel?: string;
}

export function EditableList<T>({
  items,
  onAdd,
  onDelete,
  renderItem,
  addLabel = "Add Item",
  title,
  icon,
  emptyLabel = "No entries found.",
}: EditableListProps<T>) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          {title && <h3 className="text-white font-black uppercase tracking-[0.2em] text-xs">{title}</h3>}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); onAdd(); }}
          className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary border border-secondary/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 gradient-border-primary group relative flex gap-4"
            >
              <div className="flex-1 min-w-0">
                {renderItem(item, index)}
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={(e) => { e.preventDefault(); onDelete(index); }}
                  className="p-2 bg-red-500/10 hover:bg-red-500 text-white rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:-translate-y-0.5"
                  title="Remove Entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10 text-white/20">
            <p className="text-[10px] font-black uppercase tracking-widest italic">{emptyLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
