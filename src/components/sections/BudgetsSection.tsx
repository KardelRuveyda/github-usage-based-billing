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
          { from: "Door 1 — always locked",   to: "Universal user-level budget · checked FIRST, even before the pool" },
          { from: "Door 2 — always locked",   to: "Individual user-level override · same gate, per-person cap" },
          { from: "Door 3 — toggle-driven",   to: "Cost-center budget · Enterprise only · CC ≠ Org (CC is a billing group, Org is the org boundary)" },
          { from: "Door 4 — toggle-driven",   to: "Enterprise spending limit · master cap · can exclude CC users via toggle" },
        ]}
        footnote="ULB is the only door that runs in pool-phase too — so a user can be blocked while the pool still has free credits. On Copilot Business there is no cost-center; use per-user override. ‘Exclude CC usage from Ent’ lets CC teams keep going after the enterprise cap blocks everyone else."
      />
    </SectionShell>
  );
}
