"use client";

import { motion } from "framer-motion";
import { SECTIONS } from "@/lib/sections";

const TOTAL_SLIDES = SECTIONS.reduce((n, s) => n + (s.parts ?? 1), 0);

/**
 * Opening slide of the deck. Animated gradient title + tagline + key hint.
 */
export function TitleSlide() {
  const words = ["Usage-Based", "Billing"];
  const tagline = "GitHub Copilot · 2026 pricing, explained one slide at a time.";

  return (
    <div className="min-h-full w-full flex items-center justify-center px-5 py-10">
      <div className="max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="eyebrow"
        >
          GitHub Copilot · 2026 Pricing Model
        </motion.span>

        <h1 className="mt-8 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.02]">
          {words.map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.15 }}
              className="inline-block gradient-text mr-3"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-8 max-w-xl text-lg md:text-xl text-[var(--text-muted)] leading-relaxed"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.85 }}
          className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--line)] bg-[rgba(22,27,34,0.55)]"
        >
          <span className="tiny uppercase tracking-[0.2em] text-[var(--text-muted)]">Presented by</span>
          <span className="text-sm font-semibold text-[var(--text)]">Kardel Rüveyda Çetin</span>
          <span className="opacity-40">·</span>
          <span className="text-sm text-[var(--text-muted)]">Digital Cloud Solution Architect</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div
            className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <kbd>→</kbd>
            <span>press to begin</span>
          </motion.div>
          <span className="text-[var(--text-muted)] text-sm">·</span>
          <span className="text-sm text-[var(--text-muted)]">
            <kbd>←</kbd> <kbd>→</kbd> navigate · <kbd>F</kbd> fullscreen
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-16 text-xs font-mono uppercase tracking-[0.3em] text-[var(--text-muted)]"
        >
          {TOTAL_SLIDES} slides
        </motion.div>
      </div>
    </div>
  );
}
