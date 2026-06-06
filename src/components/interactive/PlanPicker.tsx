"use client";

import { useState } from "react";
import { PLANS, PROMO } from "@/lib/models";

export function PlanPicker() {
  const [selected, setSelected] = useState("business");
  const [seats, setSeats]       = useState(50);
  const [usePromo, setUsePromo] = useState(true);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                selected === p.id
                  ? "border-[rgba(137,87,229,0.6)] bg-[rgba(137,87,229,0.18)] text-white"
                  : "border-[var(--line)] text-[var(--text-muted)] hover:text-white hover:bg-white/5"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <label className="ml-auto flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={usePromo}
            onChange={(e) => setUsePromo(e.target.checked)}
            className="w-4 h-4 accent-[var(--purple)]"
          />
          <span>
            Show <strong>promotional</strong> credits ({PROMO.label})
          </span>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {PLANS.map((p) => {
          const active = p.id === selected;
          const credits = usePromo ? p.promotionalAiCredits : p.includedAiCredits;
          const monthlyPool = credits * seats;
          return (
            <div
              key={p.id}
              className={`relative rounded-2xl p-6 border bg-gradient-to-b from-[rgba(22,27,34,0.85)] to-[rgba(22,27,34,0.6)] overflow-hidden transition-all ${
                active ? "border-[rgba(137,87,229,0.6)] scale-[1.01]" : "border-[var(--line)]"
              }`}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: "var(--accent-gradient)" }}
              />
              <div className="flex items-baseline justify-between">
                <div className="tiny uppercase text-[var(--blue)] tracking-widest">{p.name}</div>
                {usePromo && (
                  <span className="tier-pill premium">PROMO</span>
                )}
              </div>
              <div className="font-mono text-3xl font-bold mt-2">
                ${p.pricePerUserMonth}
                <span className="text-[var(--text-muted)] text-sm font-normal"> / user / month</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="font-mono text-2xl font-bold gradient-text">
                    {credits.toLocaleString()}
                  </div>
                  <div className="tiny">AI credits / user / month</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-[var(--green)]">
                    {monthlyPool.toLocaleString()}
                  </div>
                  <div className="tiny">pooled across {seats} seats</div>
                </div>
              </div>

              <p className="tiny mt-3">{p.audience}</p>

              <ul className="text-sm text-[var(--text-muted)] space-y-1.5 mt-3 list-disc list-inside">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="glass p-4 mt-5 flex flex-wrap items-center gap-4">
        <span className="tiny uppercase">Org size</span>
        <input
          type="range"
          className="gh-range flex-1 min-w-[180px]"
          min={1}
          max={500}
          step={1}
          value={seats}
          onChange={(e) => setSeats(+e.target.value)}
        />
        <span className="font-mono font-bold text-[var(--blue)]">{seats} seats</span>
      </div>

      <p className="tiny mt-3">
        AI credits are pooled at the billing entity. Anything beyond the pool is
        metered at <strong>$0.01 USD per credit</strong>.
      </p>
    </div>
  );
}
