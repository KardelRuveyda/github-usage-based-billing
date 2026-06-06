"use client";

import { motion } from "framer-motion";

/**
 * Same package, three different shipping carriers, three different prices.
 * Mirrors: same prompt, different LLMs, very different credit cost.
 */
export function DeliveryTrucksViz() {
  const carriers = [
    { name: "Economy",  color: "var(--green)",  emoji: "🚚", price: "0.5 cr",  badge: "cheap" },
    { name: "Standard", color: "var(--blue)",   emoji: "🚛", price: "1.5 cr",  badge: "mid-tier" },
    { name: "Premium",  color: "var(--purple)", emoji: "✈️", price: "5.0 cr",  badge: "top-tier" },
  ];

  return (
    <div className="w-full max-w-[300px] space-y-2.5">
      <div className="text-center text-[11px] text-[var(--text-muted)] mb-2">
        Same package 📦 → different carrier → different bill
      </div>
      {carriers.map((c, i) => (
        <motion.div
          key={c.name}
          className="flex items-center gap-3 rounded-lg border bg-[var(--bg-1)] px-3 py-2"
          style={{ borderColor: `${c.color}55` }}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: [-40, 0, 0, -40], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.2,
            times: [0, 0.2, 0.85, 1],
          }}
        >
          <span className="text-xl">📦</span>
          <span className="text-[11px] text-[var(--text-muted)]">→</span>
          <span className="text-2xl">{c.emoji}</span>
          <div className="flex-1">
            <div className="text-xs font-semibold text-white leading-tight">{c.name}</div>
            <div className="text-[10px] text-[var(--text-muted)] leading-tight">
              {c.badge}
            </div>
          </div>
          <div
            className="font-mono text-sm font-bold tabular-nums"
            style={{ color: c.color }}
          >
            {c.price}
          </div>
        </motion.div>
      ))}
      <div className="text-center text-[10px] text-[var(--text-muted)] pt-1">
        each model = its own rate
      </div>
    </div>
  );
}
