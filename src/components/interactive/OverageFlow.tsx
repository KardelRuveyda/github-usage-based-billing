"use client";

import { useState } from "react";

/**
 * OverageFlow — animated step-through of what happens when an org / user
 * crosses the spending limit. Click steps to advance.
 */
const STEPS = [
  {
    state: "ok",
    title: "Within the pool",
    body: "The org has plenty of included AI credits. Every billable Copilot interaction draws from the shared pool — no metered (paid) usage yet.",
    pct: 42,
  },
  {
    state: "warn",
    title: "Pool nearly exhausted (75%)",
    body: "Admins receive an email. Users keep working uninterrupted, and the AI usage dashboard surfaces a banner showing how many credits remain.",
    pct: 78,
  },
  {
    state: "critical",
    title: "Metered phase begins",
    body: "Pool is depleted. Every credit now costs $0.01 USD and counts against the enterprise / cost-center budget. Code completions stay free and unlimited.",
    pct: 96,
  },
  {
    state: "blocked",
    title: "Budget limit reached",
    body: "With ‘Stop usage when budget limit is reached’ ON, billed features are blocked until the next cycle or until the limit is raised. Code completions still work.",
    pct: 100,
  },
];

export function OverageFlow() {
  const [i, setI] = useState(0);
  const step = STEPS[i];

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
      <div className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="tier-pill standard">In-product banner preview</span>
          <span className="tiny ml-auto">Step {i + 1} / {STEPS.length}</span>
        </div>

        {/* Fake VS Code chat surface */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-0)] overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--line)] tiny font-mono">
            GitHub Copilot Chat
          </div>

          <div className="p-4 min-h-[180px] flex flex-col gap-3">
            <Banner state={step.state as keyof typeof palette} title={step.title} body={step.body} />

            <div className="mt-2 text-sm text-[var(--text-muted)] font-mono">
              <span className="text-[var(--green)]">user&gt;</span> Explain this function
            </div>

            {step.state === "blocked" ? (
              <div className="text-sm text-[var(--red)] font-mono">
                <span>copilot&gt;</span> Sorry — billed features are paused until the enterprise spending limit is raised.
              </div>
            ) : (
              <div className="text-sm text-[var(--text-muted)] font-mono">
                <span className="text-[var(--blue)]">copilot&gt;</span> Sure — this function parses…
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            className="px-4 py-2 rounded-lg text-sm border border-[var(--line)] text-[var(--text-muted)] hover:text-white"
          >
            ← prev
          </button>
          <button
            onClick={() => setI((v) => Math.min(STEPS.length - 1, v + 1))}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "var(--accent-gradient)" }}
          >
            next →
          </button>
        </div>
      </div>

      {/* Side panel: meter */}
      <div className="bg-[rgba(13,17,23,0.65)] border border-[var(--line)] rounded-2xl p-6">
        <div className="tiny uppercase mb-2">Spending limit</div>
        <div className="text-3xl font-mono font-bold">${step.pct === 100 ? 500 : Math.round(500 * step.pct / 100)} <span className="text-[var(--text-muted)] text-sm">/ $500</span></div>

        <div className="w-full h-4 bg-[var(--bg-2)] rounded-full overflow-hidden mt-4">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${step.pct}%`,
              background:
                step.state === "ok"       ? "var(--green)"  :
                step.state === "warn"     ? "var(--yellow)" :
                step.state === "critical" ? "#f59e0b"       : "var(--red)",
            }}
          />
        </div>

        <ol className="mt-6 space-y-2 text-sm">
          {STEPS.map((s, idx) => (
            <li
              key={s.state}
              onClick={() => setI(idx)}
              className={`cursor-pointer px-3 py-2 rounded-lg border transition-colors ${
                idx === i
                  ? "border-[rgba(137,87,229,0.6)] bg-[rgba(137,87,229,0.12)] text-white"
                  : "border-transparent text-[var(--text-muted)] hover:bg-white/5"
              }`}
            >
              <span className="font-mono tiny mr-2">0{idx + 1}</span>
              {s.title}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

const palette = {
  ok:       { bg: "rgba(63,185,80,0.08)",  border: "rgba(63,185,80,0.4)",  color: "var(--green)"  },
  warn:     { bg: "rgba(210,153,34,0.10)", border: "rgba(210,153,34,0.4)", color: "var(--yellow)" },
  critical: { bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.4)", color: "#f59e0b"       },
  blocked:  { bg: "rgba(248,81,73,0.10)",  border: "rgba(248,81,73,0.4)",  color: "var(--red)"    },
};

function Banner({
  state,
  title,
  body,
}: {
  state: keyof typeof palette;
  title: string;
  body: string;
}) {
  const p = palette[state];
  return (
    <div
      className="rounded-lg border px-4 py-3 text-sm"
      style={{ background: p.bg, borderColor: p.border, color: p.color }}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-[var(--text-muted)] mt-1">{body}</div>
    </div>
  );
}
