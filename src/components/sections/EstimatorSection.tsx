import { SectionShell } from "@/components/SectionShell";
import { CreditConsumptionEstimator } from "@/components/interactive/CreditConsumptionEstimator";
import { Analogy } from "@/components/analogies/Analogy";
import { CupVsTankViz } from "@/components/analogies/CupVsTankViz";

type Props = { part?: "a" | "b" };

const TITLE = "Monthly AI credit estimator";

export function EstimatorSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="estimator" eyebrow="06 · Estimate it" title={TITLE} compact>
        <CreditConsumptionEstimator />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="estimator"
      eyebrow="06 · Day-to-day"
      title={TITLE}
      intro={
        <>
          Next slide lets you set chat messages, agent runs and CLI calls a typical seat does per day, then projects monthly credit consumption against the per-seat allowance — standard and promotional.
        </>
      }
    >
      <Analogy
        emoji="🛢️"
        title="A cup of water vs a tank of water"
        subtitle="Same pool, very different drain speeds"
        visual={<CupVsTankViz />}
        mapping={[
          { from: "100 people drink 50 cups each per day", to: "Chat-heavy use — pool lasts the whole month" },
          { from: "One person walks in, dumps a tank",     to: "One cloud agent run — worth 40–60 chats" },
          { from: "The tank warning comes too late",       to: "A misbehaving agent can drain the pool in hours" },
          { from: "What you actually watch: the tank",     to: "Admins focus on ‘who is launching agents’" },
        ]}
        footnote="What drains the pool isn’t ‘the heavy chatter’ — it’s ‘the agent launcher’."
      />
    </SectionShell>
  );
}
