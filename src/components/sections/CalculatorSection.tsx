import { SectionShell } from "../SectionShell";
import { ModelCalculator } from "../interactive/ModelCalculator";
import { Analogy } from "../analogies/Analogy";
import { DeliveryTrucksViz } from "../analogies/DeliveryTrucksViz";

type Props = { part?: "a" | "b" };

const TITLE = <>Live <span className="gradient-text">token → credit</span> calculator</>;

export function CalculatorSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="calculator" eyebrow="05 · Run the math" title={TITLE} compact>
        <ModelCalculator />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="calculator"
      eyebrow="05 · Try it"
      title={TITLE}
      intro="On the next slide you drag the sliders and switch models — the same 10,000-token interaction maps to wildly different AI credit amounts. That's why the model catalog matters as much as the seat count."
    >
      <Analogy
        emoji="📦"
        title="Same package, different shipping carrier"
        subtitle="What’s inside is identical — the brand on the truck sets the price"
        visual={<DeliveryTrucksViz />}
        mapping={[
          { from: "Package size / weight",          to: "Token count (input + output)" },
          { from: "Which carrier you pick",         to: "Which LLM you pick" },
          { from: "Same parcel — ground vs air",     to: "Same prompt — Haiku vs Opus" },
          { from: "Different speed, different price", to: "A 10× spread between models is normal" },
        ]}
        footnote="That’s why ‘will the pool cover us?’ doesn’t just depend on headcount — it also depends on which models the team reaches for."
      />
    </SectionShell>
  );
}
