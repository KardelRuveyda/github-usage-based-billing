import { SectionShell } from "../SectionShell";
import { MIN_VERSIONS, PROMO } from "@/lib/models";

type Props = { part?: "a" | "b" };

const TITLE = <>Promotional period &amp; <span className="gradient-text">rollout plan</span></>;

export function MigrationSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="migration" eyebrow="11 · Minimum client versions" title={TITLE} compact>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Older IDE plugins won&apos;t show the new pricing accurately — make sure your teams are on at least these versions:
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {MIN_VERSIONS.map((v) => (
            <div key={v.name} className="border border-[var(--line)] rounded-lg p-3">
              <div className="text-sm font-semibold">{v.name}</div>
              <div className="font-mono text-xs text-[var(--blue)] mt-1">≥ {v.version}</div>
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="migration"
      eyebrow="11 · Timeline"
      title={TITLE}
      intro={
        <>
          Existing customers get a 3-month credit boost — <strong>{PROMO.label}</strong> — to switch friction-free. Follow the 5 steps before the promo window closes.
        </>
      }
    >
      <ol className="relative border-l-2 border-[var(--line)] pl-5 ml-1 space-y-2">
        <Phase
          color="var(--blue)"
          tag={`Step 1 · ${PROMO.startISO}`}
          title="Promotional credits become active"
          body="Existing Business seats jump from 1,900 → 3,000 AI credits / user / month. Existing Enterprise seats jump from 3,900 → 7,000 / user / month. The lift is automatic; no action required."
        />
        <Phase
          color="var(--yellow)"
          tag="Step 2 · Set the user-level budget"
          title="Set a universal ULB above the per-license value"
          body="Pick a number that covers normal-to-heavy use (e.g. 2× the per-seat allowance). This caps any single user — the only layer that always hard-stops."
        />
        <Phase
          color="var(--green)"
          tag="Step 3 · Identify power users"
          title="Override the ULB for known heavy consumers"
          body="Cloud-agent users, Spark builders, and platform teams should get explicit per-user budgets. The lowest-headroom check still applies, but they won't trip the universal cap."
        />
        <Phase
          color="var(--purple)"
          tag="Step 4 · Configure the enterprise limit"
          title="Set the spending limit + enable the hard stop"
          body="In Settings → Billing → Spending limits, set a monthly USD cap. Then flip 'Stop usage when budget limit is reached' so cost-center / enterprise budgets actually enforce instead of just alerting."
        />
        <Phase
          color="var(--pink)"
          tag={`Step 5 · before ${PROMO.endISO}`}
          title="Monitor regularly · adjust before standard rates resume"
          body="The AI usage dashboard updates daily. Reconcile actual draw vs the standard pool size (1,900 / 3,900) so you're not surprised when the promo ends."
        />
      </ol>
    </SectionShell>
  );
}

function Phase({
  color,
  tag,
  title,
  body,
}: {
  color: string;
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <li className="relative">
      <span
        className="absolute -left-[42px] top-1 w-4 h-4 rounded-full"
        style={{ background: color, boxShadow: `0 0 0 4px var(--bg-0), 0 0 0 6px ${color}55` }}
      />
      <div className="tiny uppercase tracking-widest" style={{ color }}>{tag}</div>
      <h3 className="text-xl font-semibold mt-1">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] mt-2 max-w-2xl leading-relaxed">{body}</p>
    </li>
  );
}
