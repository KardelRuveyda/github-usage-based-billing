"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/**
 * 4-door apartment metaphor for the 4 budget layers.
 * Doors 1-2: always locked (hard-stop).
 * Doors 3-4: lock state toggled by "Stop usage" switch.
 * Hover/click on the switch to see the locks change.
 */
export function ApartmentDoorsViz() {
  const [stopUsage, setStopUsage] = useState(true);

  const doors = [
    { label: "User ULB",      always: true,  color: "var(--green)" },
    { label: "Individual ULB", always: true,  color: "var(--green)" },
    { label: "Cost Center",   always: false, color: "var(--yellow)" },
    { label: "Enterprise",    always: false, color: "var(--purple)" },
  ];

  return (
    <div className="w-full max-w-[320px] flex flex-col items-center gap-3">
      <div className="flex gap-2 w-full">
        {doors.map((d) => {
          const locked = d.always || stopUsage;
          return (
            <div
              key={d.label}
              className="flex-1 flex flex-col items-center"
            >
              {/* door */}
              <div
                className="relative w-full h-24 rounded-t-lg border-2 transition-colors"
                style={{
                  borderColor: locked ? d.color : `${d.color}40`,
                  background: locked ? `${d.color}15` : "transparent",
                }}
              >
                {/* lock icon */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg"
                  key={`${d.label}-${locked}`}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {locked ? "🔒" : "🔓"}
                </motion.div>
                {/* knob */}
                <div
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ background: d.color }}
                />
              </div>
              <div className="text-[9px] text-center text-[var(--text-muted)] mt-1 leading-tight">
                {d.label}
              </div>
              <div className="text-[8px] text-center font-mono leading-tight" style={{ color: d.color }}>
                {d.always ? "always" : "toggle-driven"}
              </div>
            </div>
          );
        })}
      </div>

      {/* toggle */}
      <button
        onClick={() => setStopUsage((v) => !v)}
        className="mt-2 flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--bg-1)] px-3 py-2 text-xs hover:border-[var(--blue)]/60 transition-colors"
      >
        <span className="text-[var(--text-muted)]">
          &ldquo;Stop usage when limit reached&rdquo;
        </span>
        <span
          className="relative w-9 h-5 rounded-full transition-colors"
          style={{ background: stopUsage ? "var(--green)" : "var(--bg-2)" }}
        >
          <motion.span
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
            animate={{ left: stopUsage ? 18 : 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />
        </span>
        <span
          className="font-mono text-[10px]"
          style={{ color: stopUsage ? "var(--green)" : "var(--text-muted)" }}
        >
          {stopUsage ? "ON" : "OFF"}
        </span>
      </button>

      <div className="text-[10px] text-center text-[var(--text-muted)] leading-snug">
        Click the toggle to see doors 3 &amp; 4 lock/unlock
      </div>
    </div>
  );
}
