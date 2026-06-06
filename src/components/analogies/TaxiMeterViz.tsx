"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Taxi meter analogy: three stages that loop.
 *  1. Taxi drives → distance grows  (tokens)
 *  2. Meter ticks dollars            (USD)
 *  3. Receipt punches credits        (AI credits)
 */
export function TaxiMeterViz() {
  return (
    <div className="w-full max-w-[340px] space-y-3">
      <Stage label="DISTANCE" sub="tokens">
        <div className="flex items-center gap-3">
          <motion.div
            className="text-2xl"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            🚕
          </motion.div>
          <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-2)] overflow-hidden">
            <motion.div
              className="h-full bg-[var(--blue)]"
              animate={{ width: ["0%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="font-mono text-xs text-[var(--blue)] w-16 text-right">
            <Ticker from={0} to={2400} duration={4} suffix=" tok" />
          </div>
        </div>
      </Stage>

      <Arrow />

      <Stage label="DOLLARS" sub="$ / 1M token rate">
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-[var(--text-muted)]">meter:</div>
          <div className="flex-1 text-center font-mono text-lg font-bold text-[var(--yellow)]">
            $<Ticker from={0} to={0.024} duration={4} decimals={5} />
          </div>
        </div>
      </Stage>

      <Arrow />

      <Stage label="CREDITS" sub="× 100  (1 credit = $0.01)">
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-[var(--text-muted)]">receipt:</div>
          <div className="flex-1 text-center font-mono text-lg font-bold text-[var(--green)]">
            <Ticker from={0} to={2.4} duration={4} decimals={2} /> cr
          </div>
        </div>
      </Stage>
    </div>
  );
}

function Stage({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--bg-1)] p-3">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
          {label}
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">{sub}</span>
      </div>
      {children}
    </div>
  );
}

function Arrow() {
  return (
    <motion.div
      className="text-center text-[var(--blue)] text-lg leading-none"
      animate={{ y: [0, 3, 0] }}
      transition={{ duration: 1.4, repeat: Infinity }}
    >
      ↓
    </motion.div>
  );
}

function Ticker({
  from,
  to,
  duration,
  decimals = 0,
  suffix = "",
}: {
  from: number;
  to: number;
  duration: number;
  decimals?: number;
  suffix?: string;
}) {
  const [v, setV] = useState(from);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = ((now - start) / (duration * 1000)) % 1;
      setV(from + (to - from) * t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, duration]);
  return (
    <>
      {v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}
