"use client";

import { motion } from "framer-motion";

/**
 * Slow-drifting colored blurs in the background of the slide deck.
 * Pure decoration — pointer-events disabled.
 */
export function BackgroundOrbs() {
  const orbs = [
    { color: "rgba(137, 87, 229, 0.35)", size: 520, x: ["-10%", "10%", "-10%"], y: ["-5%", "8%", "-5%"], duration: 22, top: "-10%",  left: "-10%" },
    { color: "rgba(88, 166, 255, 0.30)", size: 480, x: ["5%", "-8%", "5%"],     y: ["-3%", "5%", "-3%"],  duration: 26, top: "-8%",   right: "-8%" },
    { color: "rgba(63, 185, 80, 0.25)",  size: 460, x: ["-6%", "6%", "-6%"],    y: ["4%", "-6%", "4%"],   duration: 30, bottom: "-12%", right: "-6%" },
    { color: "rgba(255, 126, 182, 0.22)", size: 420, x: ["8%", "-6%", "8%"],    y: ["6%", "-4%", "6%"],   duration: 28, bottom: "-10%", left: "-8%" },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            right: o.right,
            bottom: o.bottom,
            background: `radial-gradient(circle, ${o.color} 0%, transparent 65%)`,
            filter: "blur(20px)",
          }}
          animate={{ x: o.x, y: o.y }}
          transition={{ duration: o.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
