"use client";

import { useMemo, useState } from "react";
import { MODELS } from "@/lib/models";

type Activity = {
  id: string;
  label: string;
  perDay: number;
  avgTokens: number;
  outputShare: number;
  help: string;
};

const DEFAULT_ACTIVITIES: Activity[] = [
  { id: "chat",        label: "Copilot Chat messages",   perDay: 25, avgTokens: 2_500,  outputShare: 0.45, help: "Average chat turn — your question plus a paragraph of model response." },
  { id: "code-review", label: "Copilot code reviews",    perDay: 3,  avgTokens: 6_000,  outputShare: 0.55, help: "Reviewing a PR: large input (diff + context), substantial output." },
  { id: "cli",         label: "Copilot CLI invocations", perDay: 4,  avgTokens: 1_200,  outputShare: 0.50, help: "A `gh copilot` command — short prompt, short answer." },
  { id: "agent",       label: "Cloud agent sessions",    perDay: 1,  avgTokens: 60_000, outputShare: 0.40, help: "Autonomous, multi-step task touching multiple files." },
  { id: "spaces",      label: "Copilot Spaces queries",  perDay: 2,  avgTokens: 8_000,  outputShare: 0.50, help: "Grounded Q&A across a workspace's documents and code." },
];

export function CreditConsumptionEstimator() {
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES);
  const [workdays, setWorkdays]     = useState(20);
  const [modelId, setModelId]       = useState("claude-sonnet-4");

  const model = useMemo(() => MODELS.find((m) => m.id === modelId)!, [modelId]);

  const { creditsTotal, usdTotal } = useMemo(() => {
    let usd = 0;
    for (const a of activities) {
      const monthly      = a.perDay * workdays;
      const totalTokens  = monthly * a.avgTokens;
      const outputTokens = totalTokens * a.outputShare;
      const inputTokens  = totalTokens - outputTokens;
      usd += (inputTokens / 1e6) * model.inputPer1M + (outputTokens / 1e6) * model.outputPer1M;
    }
    return { creditsTotal: usd * 100, usdTotal: usd };
  }, [activities, workdays, model.inputPer1M, model.outputPer1M]);

  const update = (id: string, perDay: number) =>
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, perDay } : a)));

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
      <div className="glass p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="tier-pill premium">Per-user · per-month estimator</span>
          <span className="tiny ml-auto">code completions excluded · they&apos;re free</span>
        </div>

        {activities.map((a) => (
          <div key={a.id} className="mb-5">
            <div className="flex justify-between items-baseline mb-1">
              <div>
                <span className="font-semibold">{a.label}</span>{" "}
                <span className="tiny ml-2">~{a.avgTokens.toLocaleString()} tokens / call</span>
              </div>
              <span className="font-mono text-[var(--blue)] font-bold">
                {a.perDay}
                <span className="text-[var(--text-muted)] text-xs"> / day</span>
              </span>
            </div>
            <input
              type="range"
              className="gh-range"
              min={0}
              max={a.id === "agent" ? 10 : 80}
              step={1}
              value={a.perDay}
              onChange={(e) => update(a.id, +e.target.value)}
            />
            <p className="tiny mt-1">{a.help}</p>
          </div>
        ))}

        <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[var(--line)]">
          <div>
            <span className="tiny uppercase block mb-2">Workdays / month</span>
            <input
              type="number"
              value={workdays}
              min={1}
              max={31}
              onChange={(e) => setWorkdays(Math.max(1, Math.min(31, +e.target.value || 0)))}
              className="w-full bg-[var(--bg-1)] border border-[var(--line)] rounded-lg px-3 py-2 font-mono"
            />
          </div>
          <div>
            <span className="tiny uppercase block mb-2">Model used</span>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full bg-[var(--bg-1)] border border-[var(--line)] rounded-lg px-3 py-2 font-mono text-sm"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.tier}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[rgba(13,17,23,0.65)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-4">
        <span className="tiny uppercase">Estimated this month · per user</span>
        <div className="text-6xl font-mono font-bold gradient-text">
          {Math.round(creditsTotal).toLocaleString()}
        </div>
        <div className="tiny">AI credits · ≈ ${usdTotal.toFixed(2)} USD equivalent</div>

        <div className="mt-6 border-t border-[var(--line)] pt-4 space-y-3">
          <Compare label="Copilot Business (1,900 / user)"   used={creditsTotal} quota={1_900} />
          <Compare label="Copilot Enterprise (3,900 / user)" used={creditsTotal} quota={3_900} />
          <Compare label="Business · promo (3,000)"          used={creditsTotal} quota={3_000} />
          <Compare label="Enterprise · promo (7,000)"        used={creditsTotal} quota={7_000} />
        </div>

        <p className="tiny mt-3">
          Pooled across all users — heavy days are offset by lighter teammates&apos;
          unused credits before any overage is incurred.
        </p>
      </div>
    </div>
  );
}

function Compare({ label, used, quota }: { label: string; used: number; quota: number }) {
  const overage = Math.max(0, used - quota);
  const pct = Math.min(100, (used / quota) * 100);
  const ok = overage === 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className={ok ? "text-[var(--green)]" : "text-[var(--red)]"}>
          {ok ? "fits" : `+${Math.round(overage).toLocaleString()} cr overage`}
        </span>
      </div>
      <div className="w-full h-1.5 bg-[var(--bg-2)] rounded-full overflow-hidden mt-1">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: ok ? "var(--green)" : "var(--red)",
          }}
        />
      </div>
    </div>
  );
}
