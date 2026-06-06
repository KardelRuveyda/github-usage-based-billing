import { SectionShell } from "../SectionShell";
import { PlanPicker } from "../interactive/PlanPicker";
import { Analogy } from "../analogies/Analogy";
import { PrepaidCardViz } from "../analogies/PrepaidCardViz";

type Props = { part?: "a" | "b" };

const TITLE = <>Included AI credits <span className="gradient-text">by plan</span></>;

export function PlansSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="plans" eyebrow="04 · Pick a plan" title={TITLE} compact>
        <PlanPicker />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="plans"
      eyebrow="04 · What you get"
      title={TITLE}
      intro="Each Copilot Business or Enterprise seat comes with a fixed monthly allowance of AI credits. The next slide lets you toggle the promotional period (June 1 – Sept 1, 2026) to compare standard vs. launch-promo pools."
    >
      <Analogy
        emoji="💳"
        title="Prepaid store card"
        subtitle="The money you put in comes back as the same value of spendable credit"
        visual={<PrepaidCardViz />}
        mapping={[
          { from: "Load $19 onto the card",            to: "Business seat fee — paid" },
          { from: "Card prints 1,900 cr",              to: "Monthly AI credit pool — ready to spend" },
          { from: "1 cr is worth 1 cent",              to: "Fixed rate: 1 credit = $0.01 USD" },
          { from: "+57% bonus credit during promo",    to: "June 1 – Sept 1, 2026 launch boost" },
        ]}
        footnote="So the seat fee comes back to you as usable credit. Under normal use, the extra-bill risk is basically zero."
      />
    </SectionShell>
  );
}
