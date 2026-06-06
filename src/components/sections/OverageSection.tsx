import { SectionShell } from "../SectionShell";
import { OverageFlow } from "../interactive/OverageFlow";
import { OverageStory } from "../interactive/OverageStory";

type Props = { part?: "a" | "b" };

export function OverageSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell
        id="overage"
        eyebrow="10 · Real-world walk-through"
        title={<>One month at <span className="gradient-text">Acme FinTech</span></>}
        compact
        intro="Same four phases, but lived day by day. Click any event to see exactly what a developer sees in their IDE and what the admin gets in their inbox at that moment."
      >
        <OverageStory />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="overage"
      eyebrow="10 · Pool exhausted"
      title={<>What happens when <span className="gradient-text">credits run out</span></>}
      intro="Click through each step to see what users and admins experience as the org drains the AI credit pool and shifts into metered (paid) usage. Code completions stay free and unlimited the whole time."
    >
      <OverageFlow />
    </SectionShell>
  );
}
