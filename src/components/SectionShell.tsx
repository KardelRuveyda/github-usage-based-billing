"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  /** When true, render a slim continuation header (smaller eyebrow + title, no intro). */
  compact?: boolean;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function SectionShell({ id, eyebrow, title, intro, children, compact = false }: Props) {
  if (compact) {
    return (
      <section id={id} className="py-3 md:py-4">
        <div className="max-w-[1200px] mx-auto px-5">
          <motion.div {...fadeUp(0)} className="flex items-baseline gap-3 flex-wrap">
            <span className="eyebrow">{eyebrow}</span>
            <motion.h2
              {...fadeUp(0.06)}
              className="text-lg md:text-xl font-semibold tracking-tight text-[var(--text-muted)]"
            >
              {title}
            </motion.h2>
          </motion.div>
          <motion.div {...fadeUp(0.14)} className="mt-3">
            {children}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-4 md:py-6">
      <div className="max-w-[1200px] mx-auto px-5">
        <motion.span {...fadeUp(0)} className="inline-block eyebrow">
          {eyebrow}
        </motion.span>
        <motion.h2
          {...fadeUp(0.08)}
          className="mt-2 text-2xl md:text-4xl font-bold tracking-tight leading-tight"
        >
          {title}
        </motion.h2>
        {intro && (
          <motion.p
            {...fadeUp(0.16)}
            className="mt-2 text-[var(--text-muted)] max-w-3xl text-sm md:text-base leading-relaxed"
          >
            {intro}
          </motion.p>
        )}
        <motion.div {...fadeUp(0.24)} className="mt-4">
          {children}
        </motion.div>
      </div>
    </section>
  );
}
