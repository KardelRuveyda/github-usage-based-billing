"use client";

import { motion } from "framer-motion";

/**
 * Two parallel scenes:
 *  - Left: tap dripping into a glass (free / unmetered, like inline completions)
 *  - Right: hose with a spinning water meter (billed, like Chat/agent calls)
 */
export function WaterMeterViz() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-[340px]">
      {/* Left: free drip */}
      <div className="rounded-xl border border-[var(--green)]/40 bg-[var(--green)]/5 p-3 flex flex-col items-center">
        <div className="text-[10px] eyebrow !text-[var(--green)] mb-2 text-center">
          Kitchen tap
          <br />
          (free)
        </div>
        <div className="relative h-[120px] w-12">
          {/* tap */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-[var(--text-muted)] rounded-sm" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-5 bg-[var(--text-muted)]" />
          {/* drops */}
          {[0, 0.4, 0.8].map((delay) => (
            <motion.div
              key={delay}
              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-2 rounded-full bg-[var(--blue)]"
              initial={{ top: 32, opacity: 0 }}
              animate={{ top: [32, 90], opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay, ease: "easeIn" }}
            />
          ))}
          {/* glass */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-7 rounded-b-md border-2 border-t-0 border-[var(--blue)]/60 bg-[var(--blue)]/10" />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mt-2 text-center leading-tight">
          doesn’t touch the meter
        </div>
      </div>

      {/* Right: metered hose */}
      <div className="rounded-xl border border-[var(--red)]/40 bg-[var(--red)]/5 p-3 flex flex-col items-center">
        <div className="text-[10px] eyebrow !text-[var(--red)] mb-2 text-center">
          Garden hose
          <br />
          (metered)
        </div>
        <div className="relative h-[120px] w-full flex flex-col items-center">
          {/* spinning meter */}
          <motion.div
            className="w-14 h-14 rounded-full border-2 border-[var(--red)]/70 bg-[var(--bg-1)] flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-[var(--red)] rounded-full" />
            <div className="font-mono text-[9px] text-[var(--text-muted)]">m³</div>
          </motion.div>
          {/* hose */}
          <div className="mt-2 w-full h-3 rounded-full bg-gradient-to-r from-[var(--red)]/40 to-[var(--red)]/80" />
          {/* water spray */}
          <motion.div
            className="mt-1 w-2 h-12 bg-gradient-to-b from-[var(--blue)] to-transparent rounded-full"
            animate={{ scaleY: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mt-2 text-center leading-tight">
          every m³ hits the bill
        </div>
      </div>
    </div>
  );
}
