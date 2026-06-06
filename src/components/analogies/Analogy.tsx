"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Row = { from: string; to: string };

type Props = {
  emoji?: string;
  title: string;
  subtitle?: string;
  visual: ReactNode;
  mapping: Row[];
  footnote?: ReactNode;
};

/**
 * Generic "real-life analogy" card: animated visual on the left,
 * a "this = that" mapping table on the right. Used at the top of
 * concept-heavy sections so non-technical viewers anchor on a
 * familiar metaphor before the actual content lands.
 */
export function Analogy({ emoji = "🎯", title, subtitle, visual, mapping, footnote }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="relative rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.55)] overflow-hidden mb-10 transition-shadow hover:shadow-[0_18px_60px_-15px_rgba(137,87,229,0.45)]"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(88,166,255,0.6), transparent)" }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="px-5 pt-4 pb-3 border-b border-[var(--line)]/70 flex items-center gap-3">
        <motion.span
          className="text-xl leading-none inline-block"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {emoji}
        </motion.span>
        <div className="flex-1">
          <div className="eyebrow !text-[var(--blue)]">Real-life analogy</div>
          <div className="font-semibold text-white text-lg leading-tight">{title}</div>
          {subtitle && (
            <div className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_1fr] gap-0">
        <div className="p-5 md:p-6 flex items-center justify-center min-h-[260px] bg-[rgba(22,27,34,0.4)] border-b md:border-b-0 md:border-r border-[var(--line)]/60">
          {visual}
        </div>

        <div className="p-5 md:p-6">
          <div className="eyebrow mb-3">Analogy &nbsp;↔&nbsp; Copilot equivalent</div>
          <ul className="space-y-2.5">
            {mapping.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.07 }}
                whileHover={{ x: 4 }}
                className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center text-sm leading-snug rounded-md px-1 py-0.5 hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-[var(--text-muted)]">{r.from}</span>
                <motion.span
                  className="text-[var(--blue)] font-mono text-xs"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                >
                  →
                </motion.span>
                <span className="text-white font-medium">{r.to}</span>
              </motion.li>
            ))}
          </ul>
          {footnote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + mapping.length * 0.07 }}
              className="mt-4 pt-3 border-t border-[var(--line)]/70 text-xs text-[var(--text-muted)] leading-relaxed"
            >
              {footnote}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
