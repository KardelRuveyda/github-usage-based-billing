"use client";

import { useState } from "react";

/**
 * BudgetSlider — mimics the GitHub admin UI for setting an enterprise's
 * monthly spending limit for Copilot AI credit metered (paid) usage.
 */
export function BudgetSlider() {
  const [limit, setLimit] = useState(2_500);   // USD/month enterprise limit
  const [alertAt, setAlertAt] = useState(75);  // % threshold

  const projected = 1_840; // illustrative current run-rate (USD)
  const pct = Math.min(100, (projected / Math.max(1, limit)) * 100);

  return (
    <div className="glass p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="tier-pill standard">Settings → Billing → Spending limits</span>
        <span className="tiny ml-auto">Mock UI · enterprise scope</span>
      </div>

      <h3 className="text-xl font-semibold mb-1">Enterprise spending limit</h3>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        Caps metered Copilot AI credit usage across the entire enterprise once
        the included pool is depleted. Acts as a hard stop only when&nbsp;
        <em>Stop usage when budget limit is reached</em> is enabled.
      </p>

      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="tiny uppercase">Monthly limit</span>
          <span className="font-mono font-bold text-2xl text-[var(--blue)]">
            ${limit.toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          className="gh-range"
          min={0}
          max={20_000}
          step={100}
          value={limit}
          onChange={(e) => setLimit(+e.target.value)}
        />
        <div className="flex justify-between mt-1 tiny">
          <span>$0 (no metered usage allowed)</span>
          <span>$20,000</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="tiny uppercase">Alert admins at</span>
          <span className="font-mono font-bold text-2xl text-[var(--yellow)]">{alertAt}%</span>
        </div>
        <input
          type="range"
          className="gh-range"
          min={25}
          max={100}
          step={5}
          value={alertAt}
          onChange={(e) => setAlertAt(+e.target.value)}
        />
      </div>

      <div className="bg-[rgba(13,17,23,0.65)] border border-[var(--line)] rounded-xl p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--text-muted)]">Projected metered spend this month</span>
          <span className="font-mono text-white">${projected.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 bg-[var(--bg-2)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background:
                pct < alertAt
                  ? "var(--green)"
                  : pct < 100
                  ? "var(--yellow)"
                  : "var(--red)",
            }}
          />
        </div>
        <div className="flex justify-between mt-2 tiny">
          <span>$0</span>
          <span style={{ color: pct >= 100 ? "var(--red)" : "var(--text-muted)" }}>
            {pct.toFixed(0)}% of ${limit.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="tiny mt-4">
        Tip: set the limit to <strong>$0</strong> for an immediate hard stop —
        the org pool stays in effect but no paid (metered) usage is ever incurred.
      </p>
    </div>
  );
}
