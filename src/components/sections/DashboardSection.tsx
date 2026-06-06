import { SectionShell } from "../SectionShell";
import { UsageDashboard } from "../interactive/UsageDashboard";
import { Analogy } from "../analogies/Analogy";
import { FuelGaugeViz } from "../analogies/FuelGaugeViz";

type Props = { part?: "a" | "b" };

const TITLE = <>AI usage dashboard <span className="gradient-text">(mock)</span></>;

export function DashboardSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="dashboard" eyebrow="09 · The mock dashboard" title={TITLE} compact>
        <UsageDashboard />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="dashboard"
      eyebrow="09 · See it"
      title={TITLE}
      intro="Next slide recreates what billing managers see in the AI usage dashboard: pool remaining, top consumers, and a breakdown by model — the fastest way to spot a runaway agent before the invoice does."
    >
      <Analogy
        emoji="⛽"
        title="A car’s fuel gauge"
        subtitle="One glance tells you whether you’ll make it to the end of the month"
        visual={<FuelGaugeViz />}
        mapping={[
          { from: "Needle at F (full)",         to: "Fresh pool, start of cycle" },
          { from: "Needle at ½ — yellow zone",   to: "Half gone, watch the trend" },
          { from: "Needle approaching E (empty)", to: "Metered phase incoming — step in" },
          { from: "No surprise for the passenger", to: "Catch a runaway agent before the invoice does" },
        ]}
        footnote="If a cloud agent is misconfigured, the dashboard surfaces it days before the bill ever does."
      />
    </SectionShell>
  );
}
