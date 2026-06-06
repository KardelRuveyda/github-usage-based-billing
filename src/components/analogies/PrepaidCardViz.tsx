"use client";

import { motion } from "framer-motion";

/**
 * A coin labelled "$19" drops into a prepaid market card slot,
 * the card then ejects "1900 cr" as a printed receipt strip.
 * Mirrors: pay $19 seat fee → receive $19 worth of credits.
 */
export function PrepaidCardViz() {
  return (
    <div className="relative w-full max-w-[300px] mx-auto h-[220px]">
      {/* falling coin */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#fde047] to-[#ca8a04] border-2 border-[#a16207] flex items-center justify-center text-[#7c2d12] font-bold text-sm shadow-lg"
        initial={{ top: -10, opacity: 0 }}
        animate={{ top: [-10, 60, 60, -10], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.35, 0.55, 0.6] }}
      >
        $19
      </motion.div>

      {/* the card */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-56 h-32 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[var(--blue)]/60 shadow-[0_10px_30px_-10px_rgba(88,166,255,0.4)] overflow-hidden">
        {/* slot */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-black/80 rounded-b-md" />
        {/* chip */}
        <div className="absolute top-5 left-4 w-7 h-5 rounded-sm bg-gradient-to-br from-yellow-200 to-yellow-500 border border-yellow-700/50" />
        <div className="absolute top-5 right-4 text-[9px] font-mono text-[var(--text-muted)]">
          COPILOT
        </div>
        <div className="absolute bottom-3 left-4 right-4 font-mono text-[10px] text-[var(--text-muted)] tracking-wider">
          •••• 2026
        </div>
        <div className="absolute bottom-3 right-4 text-xs font-bold text-white">
          Business
        </div>
      </div>

      {/* receipt strip */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-40 rounded-md bg-white text-[#0d1117] px-3 py-2 shadow-lg"
        initial={{ top: 215, opacity: 0 }}
        animate={{ top: [215, 195, 195, 215], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0.55, 0.75, 0.92, 1] }}
      >
        <div className="text-[8px] font-mono text-[#0d1117]/60 uppercase tracking-wider text-center">
          AI credit
        </div>
        <div className="text-center font-bold text-lg leading-tight">1,900 cr</div>
        <div className="text-[8px] text-center text-[#0d1117]/60">= worth $19</div>
      </motion.div>
    </div>
  );
}
