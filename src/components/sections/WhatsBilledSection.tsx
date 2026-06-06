import { SectionShell } from "@/components/SectionShell";
import { BILLED_FEATURES, UNBILLED_FEATURES } from "@/lib/models";
import { Analogy } from "@/components/analogies/Analogy";
import { WaterMeterViz } from "@/components/analogies/WaterMeterViz";

type Props = { part?: "a" | "b" };

const TITLE = "What does (and doesn't) consume AI credits";

export function WhatsBilledSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="whats-billed" eyebrow="02 · Billed vs free" title={TITLE} compact>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--red)]" />
              <span className="eyebrow !text-[var(--red)]">Billed · draws AI credits</span>
            </div>
            <ul className="space-y-2">
              {BILLED_FEATURES.map((f) => (
                <li key={f.name} className="border-l-2 border-[var(--red)] pl-3 py-0.5">
                  <div className="text-sm font-semibold">{f.name}</div>
                  <p className="tiny mt-0.5">{f.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--green)]" />
              <span className="eyebrow !text-[var(--green)]">Free · always unlimited</span>
            </div>
            <ul className="space-y-2">
              {UNBILLED_FEATURES.map((f) => (
                <li key={f.name} className="border-l-2 border-[var(--green)] pl-3 py-0.5">
                  <div className="text-sm font-semibold">{f.name}</div>
                  <p className="tiny mt-0.5">{f.desc}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-[var(--line)] text-xs text-[var(--text-muted)]">
              <strong className="text-[var(--text)]">Why this matters:</strong> 80% of a typical developer&apos;s
              Copilot interactions are inline completions — and those stay outside the meter entirely.
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="whats-billed"
      eyebrow="02 · The meter"
      title={TITLE}
      intro={
        <>
          Usage-based billing only counts the heavy stuff. Day-to-day completions stay unlimited on every paid plan —
          only AI-model-backed surfaces draw from your credit pool.
        </>
      }
    >
      <Analogy
        emoji="🚰"
        title="Kitchen tap vs garden hose"
        subtitle="Tiny everyday use stays free; the wide-open flow goes through the meter"
        visual={<WaterMeterViz />}
        mapping={[
          { from: "A glass of water at the sink",  to: "Inline code completion — free" },
          { from: "Steady little drips",           to: "Next edit suggestions — free" },
          { from: "Garden hose, m³ meter spinning", to: "Chat / CLI / agent / Spaces / Spark — metered" },
          { from: "You opened the hose on purpose", to: "You asked the AI to take on real work" },
        ]}
        footnote="Roughly 80% of a typical developer’s Copilot use lives on the free “kitchen tap” side — the meter never sees it."
      />
    </SectionShell>
  );
}
