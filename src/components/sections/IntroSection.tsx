import { SectionShell } from "../SectionShell";
import { Analogy } from "../analogies/Analogy";
import { CellPhoneViz } from "../analogies/CellPhoneViz";

type Props = { part?: "a" | "b" };

const TITLE = (
  <>
    What is <span className="gradient-text">Usage-Based Billing</span>?
  </>
);

export function IntroSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="intro" eyebrow="01 · Why it matters" title={TITLE} compact>
        <div className="grid md:grid-cols-3 gap-3">
          <Card title="One predictable currency"  body="AI credits replace the old premium-request multipliers. 1 credit = $0.01 USD — that's it." color="var(--blue)" />
          <Card title="Pooled across the entity" body="Every licensed seat contributes credits to a shared pool — heavy and light users balance each other out automatically." color="var(--green)" />
          <Card title="Four layers of control"   body="Universal user budget, per-user override, cost-center limit, and an enterprise spending limit. You decide what's a hard stop." color="var(--purple)" />
        </div>

        <div className="mt-4 p-4 rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.5)]">
          <p className="text-sm text-[var(--text-muted)]">
            <strong className="text-white">Why the change?</strong> Copilot now ships agents, Spaces, Spark and a
            model catalog where a single autonomous run can consume more tokens than a developer types all month.
            A flat per-seat fee can&apos;t fairly cover both inline completions and multi-hour agent sessions —
            UBB exposes the difference and gives admins direct control.
          </p>
        </div>

        <p className="tiny mt-3">
          Audience: organization owners, enterprise owners and billing managers on Copilot Business or Enterprise.
        </p>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="intro"
      eyebrow="01 · Start here"
      title={TITLE}
      intro="GitHub Copilot Business and Enterprise are moving to a usage-based model built on AI credits. Your seat price stays the same, every seat ships with a monthly pool of AI credits, and anything beyond the pool is metered at a flat $0.01 USD per credit."
    >
      <Analogy
        emoji="📱"
        title="Prepaid mobile data plan"
        subtitle="UBB is the same mental model you already use on your phone"
        visual={<CellPhoneViz />}
        mapping={[
          { from: "Monthly line fee (fixed)",          to: "Seat fee — $19 / $39" },
          { from: "Included pack (GB / minutes / SMS)", to: "Monthly AI credit pool" },
          { from: "Per-minute meter when pack ends",    to: "Metered — $0.01 / credit" },
          { from: "“Stop when my pack ends” option",     to: "Spending limit hard-stop toggle" },
        ]}
        footnote="It’s not a brand new concept — the only difference is what gets metered: AI usage instead of phone minutes."
      />
    </SectionShell>
  );
}

function Card({ title, body, color }: { title: string; body: string; color: string }) {
  return (
    <div className="glass">
      <div className="w-10 h-10 rounded-lg mb-3" style={{ background: color, opacity: 0.25 }} />
      <h3 className="text-lg font-semibold mb-2" style={{ color }}>{title}</h3>
      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{body}</p>
    </div>
  );
}
