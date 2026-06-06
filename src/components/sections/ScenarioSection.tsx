import { SectionShell } from "@/components/SectionShell";
import { ScenarioBuilder } from "@/components/interactive/ScenarioBuilder";

export function ScenarioSection() {
  return (
    <SectionShell
      id="scenario"
      eyebrow="12 · Demo · Your topology"
      title={<>What will this cost <span className="gradient-text">my org?</span></>}
      compact
    >
      <ScenarioBuilder />
    </SectionShell>
  );
}
