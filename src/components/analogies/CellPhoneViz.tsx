"use client";

import { motion } from "framer-motion";

/**
 * Cell phone with a data-pack bar that drains, then a yellow
 * "overage" tick appears past zero. Mirrors the UBB flow:
 * included pool → metered overage.
 */
export function CellPhoneViz() {
  return (
    <div className="relative w-[180px] h-[260px] mx-auto">
      {/* phone body */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-[#1f2937] to-[#0d1117] border border-[var(--line)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
        {/* notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black/80" />
        {/* screen */}
        <div className="absolute inset-3 top-7 rounded-[20px] bg-[#0d1117] border border-[var(--line)]/70 p-3 flex flex-col">
          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Included data
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mb-2">
            8 GB / 30 days
          </div>

          {/* drain bar */}
          <div className="relative h-2 rounded-full bg-[var(--bg-2)] overflow-hidden mb-3">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--green)] to-[var(--blue)]"
              initial={{ width: "100%" }}
              animate={{ width: ["100%", "60%", "20%", "0%", "0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1">
            When the pack ends
          </div>

          {/* overage indicator */}
          <motion.div
            className="rounded-md border border-[var(--yellow)]/60 bg-[var(--yellow)]/10 px-2 py-1.5 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0, 1, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="text-[9px] font-mono text-[var(--yellow)] leading-tight">
              + overage fee
            </div>
            <div className="text-[8px] text-[var(--text-muted)] leading-tight">
              metered per minute
            </div>
          </motion.div>

          <div className="mt-auto text-[9px] text-[var(--text-muted)] leading-snug">
            or if you prefer:
            <br />
            <span className="text-[var(--red)]">stop when pack ends</span>
          </div>
        </div>
      </div>
    </div>
  );
}
