import { SectionShell } from "@/components/SectionShell";
import { BudgetControlsExplainer } from "@/components/interactive/BudgetControlsExplainer";
import { Analogy } from "@/components/analogies/Analogy";
import { ApartmentDoorsViz } from "@/components/analogies/ApartmentDoorsViz";

type Props = { part?: "a" | "b" };

const TITLE = "How budgets cap consumption";

export function BudgetsSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="budgets" eyebrow="07 · Walk a request through it" title={TITLE} compact>
        <BudgetControlsExplainer />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="budgets"
      eyebrow="07 · The four controls"
      title={TITLE}
      intro={
        <>
          GitHub gives you four overlapping budget layers. The user-level budget always enforces a hard stop; the rest only enforce when you flip the <em>Stop usage when budget limit is reached</em> toggle.
        </>
      }
    >
      <Analogy
        emoji="🚪"
        title="A four-door apartment entrance"
        subtitle="2 doors are always locked; 2 doors lock only when the toggle is on"
        visual={<ApartmentDoorsViz />}
        mapping={[
          { from: "Door 1 — always locked",   to: "Universal user-level budget · always hard-stops" },
          { from: "Door 2 — always locked",   to: "Individual user-level budget · always hard-stops" },
          { from: "Door 3 — toggle-driven",   to: "Cost-center budget · stops only when toggle is ON" },
          { from: "Door 4 — toggle-driven",   to: "Enterprise spending limit · stops only when toggle is ON" },
        ]}
        footnote="Click the toggle and watch doors 3 and 4 lock/unlock live."
      />
    </SectionShell>
  );
}
