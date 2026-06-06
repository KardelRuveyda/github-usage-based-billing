"use client";

import { useState } from "react";
import { SectionShell } from "../SectionShell";

const QA = [
  {
    q: "Will my Copilot bill suddenly go up?",
    a: "No. Your seat fee is unchanged ($19 Business / $39 Enterprise). The included AI credit pool covers normal use, and for the first three months (June 1 – September 1, 2026) existing customers get a promotional boost (3,000 Business / 7,000 Enterprise) to ease the transition.",
  },
  {
    q: "What's the difference between AI credits and the old premium requests?",
    a: "Premium requests applied per-model multipliers to a request counter. AI credits are simpler: every billable interaction is converted to a USD cost using the model's token rates, then converted at a fixed 1 credit = $0.01 USD. No per-feature multipliers, no surprise math.",
  },
  {
    q: "What stays free and unlimited?",
    a: "Code completions and next edit suggestions never draw credits on any paid plan — they remain unlimited regardless of pool state, metered phase, or spending limit. Only Chat, CLI, the cloud agent, Spaces, Spark and third-party coding agents consume credits.",
  },
  {
    q: "Do unused AI credits roll over?",
    a: "No. The pool resets each billing period. Pooling across all seats already smooths heavy and light users — rollover would only push unpredictable usage even further out.",
  },
  {
    q: "Will Copilot automatically fall back to a cheaper model when the pool runs low?",
    a: "No. There is no automatic model downgrade. The user keeps the model they chose; the request either draws from the pool, gets metered at $0.01/credit, or is blocked by a budget cap.",
  },
  {
    q: "What's the difference between universal and individual user-level budgets?",
    a: "The universal ULB applies the same monthly ceiling to every user in the entity. Individual ULBs override the universal value for specific power users — useful for agent-heavy roles. Both always enforce a hard stop; no separate toggle is required.",
  },
  {
    q: "If we add a cost center, do the included credits change?",
    a: "No. Cost centers govern only the metered (paid) phase. The shared pool is always evaluated first, at the billing entity level — cost-center budgets just decide whose paid usage gets attributed where after the pool empties.",
  },
  {
    q: "What if I set the enterprise spending limit to $0?",
    a: "Then no metered usage is ever incurred. The included pool still works normally; once it's exhausted, billed features stop entirely until the next cycle or until you raise the limit.",
  },
  {
    q: "Do users see what's happening?",
    a: "Yes. The Copilot panel and AI usage dashboard show remaining credits, current phase (pool vs metered), and any active alert thresholds. Admins also receive email notifications at the configured thresholds.",
  },
  {
    q: "Do older IDE versions show UBB pricing correctly?",
    a: "Only at the minimum versions listed in the migration step — VS Code 1.120+, Visual Studio 2022 17.14.33+, JetBrains plugin 1.9.1+, Copilot CLI 1.0.48+, and so on. Earlier clients will undercount.",
  },
];

const TITLE = <>Frequently <span className="gradient-text">asked questions</span></>;

type Props = { part?: "a" | "b" };

export function FaqSection({ part = "a" }: Props = {}) {
  const half = Math.ceil(QA.length / 2);
  const items = part === "b" ? QA.slice(half) : QA.slice(0, half);

  if (part === "b") {
    return (
      <SectionShell id="faq" eyebrow="14 · More questions" title={TITLE} compact>
        <div className="space-y-2 max-w-3xl">
          {items.map((qa, i) => (
            <Item key={i} q={qa.q} a={qa.a} />
          ))}
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="faq"
      eyebrow="14 · Common questions"
      title={TITLE}
      intro="The questions finance, security and engineering leads ask most often as they prepare for the AI credit roll-out."
    >
      <div className="space-y-2 max-w-3xl">
        {items.map((qa, i) => (
          <Item key={i} q={qa.q} a={qa.a} />
        ))}
      </div>
    </SectionShell>
  );
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[rgba(22,27,34,0.55)] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-2.5 flex items-center justify-between gap-4 hover:bg-white/5"
      >
        <span className="text-sm font-semibold">{q}</span>
        <span className="text-[var(--blue)] font-mono">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--line)]">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}
