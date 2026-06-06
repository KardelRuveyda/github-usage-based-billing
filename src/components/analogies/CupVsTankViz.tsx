"use client";

import { motion } from "framer-motion";

/**
 * Side-by-side: a self-serve buffet bar fills slowly with cups of water (chat),
 * vs. one tank dump (agent) that fills it instantly.
 */
export function CupVsTankViz() {
  return (
    <div className="w-full max-w-[340px] grid grid-cols-2 gap-3">
      {/* Left: Chat = cups */}
      <div className="rounded-xl border border-[var(--blue)]/40 bg-[var(--blue)]/5 p-3 flex flex-col items-center">
        <div className="text-[10px] eyebrow !text-[var(--blue)] mb-2 text-center">
          Chat
          <br />
          (a cup)
        </div>
        <div className="text-2xl mb-2">🥤</div>
        <div className="relative w-full h-24 rounded-md border-2 border-[var(--blue)]/60 bg-[var(--bg-1)] overflow-hidden">
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-[var(--blue)]/50"
            initial={{ height: "0%" }}
            animate={{ height: ["0%", "20%", "40%", "60%", "80%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="font-mono text-[10px] text-[var(--blue)] mt-2">
          ~1.5 cr / message
        </div>
      </div>

      {/* Right: Agent = tank */}
      <div className="rounded-xl border border-[var(--red)]/40 bg-[var(--red)]/5 p-3 flex flex-col items-center">
        <div className="text-[10px] eyebrow !text-[var(--red)] mb-2 text-center">
          Agent
          <br />
          (a tank)
        </div>
        <div className="text-2xl mb-2">🛢️</div>
        <div className="relative w-full h-24 rounded-md border-2 border-[var(--red)]/60 bg-[var(--bg-1)] overflow-hidden">
          <motion.div
            className="absolute inset-x-0 bottom-0 bg-[var(--red)]/60"
            initial={{ height: "0%" }}
            animate={{ height: ["0%", "0%", "100%", "100%"] }}
            transition={{ duration: 5, repeat: Infinity, times: [0, 0.6, 0.7, 1] }}
          />
          <motion.div
            className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[var(--red)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1] }}
            transition={{ duration: 5, repeat: Infinity, times: [0, 0.6, 0.75, 1] }}
          >
            ⚠ overflowing
          </motion.div>
        </div>
        <div className="font-mono text-[10px] text-[var(--red)] mt-2">
          ~80 cr / run
        </div>
      </div>
    </div>
  );
}
