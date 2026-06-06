"use client";

import { motion } from "framer-motion";

/**
 * Fuel gauge analogy: needle sweeps from F (full) to E (empty)
 * matching the AI usage dashboard burn-rate at-a-glance feel.
 */
export function FuelGaugeViz() {
  return (
    <div className="w-full max-w-[280px] flex flex-col items-center">
      <div className="relative w-[220px] h-[120px]">
        {/* arc background */}
        <svg viewBox="0 0 220 120" className="w-full h-full">
          <defs>
            <linearGradient id="arcGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--green)" />
              <stop offset="50%" stopColor="var(--yellow)" />
              <stop offset="100%" stopColor="var(--red)" />
            </linearGradient>
          </defs>
          <path
            d="M 20 110 A 90 90 0 0 1 200 110"
            stroke="url(#arcGrad)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          {/* tick labels */}
          <text x="20" y="118" fontSize="10" fill="var(--green)" textAnchor="middle" fontFamily="monospace">F</text>
          <text x="110" y="22" fontSize="10" fill="var(--yellow)" textAnchor="middle" fontFamily="monospace">½</text>
          <text x="200" y="118" fontSize="10" fill="var(--red)" textAnchor="middle" fontFamily="monospace">E</text>
          <text x="110" y="100" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontFamily="monospace">pool</text>
        </svg>
        {/* needle */}
        <motion.div
          className="absolute left-1/2 bottom-[10px] origin-bottom w-[3px] h-[85px] -translate-x-1/2 rounded-t-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          animate={{ rotate: [-80, -40, 0, 40, 80, 80] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* hub */}
        <div className="absolute left-1/2 bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-[var(--bg-0)]" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center w-full max-w-[220px]">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--green)]">Green</div>
          <div className="text-[10px] text-[var(--text-muted)] leading-tight">healthy month</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--yellow)]">Yellow</div>
          <div className="text-[10px] text-[var(--text-muted)] leading-tight">watch closely</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--red)]">Red</div>
          <div className="text-[10px] text-[var(--text-muted)] leading-tight">step in now</div>
        </div>
      </div>
    </div>
  );
}
