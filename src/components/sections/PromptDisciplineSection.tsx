import { SectionShell } from "../SectionShell";

const TEMPLATES: Array<{
  acronym: string;
  name: string;
  expansion: string;
  when: string;
}> = [
  {
    acronym: "TRACE",
    name: "Task · Reasoning · Approach · Constraints · Examples",
    expansion:
      "A structured request. Tell the agent what to do, why, how, what not to do, and show one example.",
    when: "Best for agent runs and multi-file edits.",
  },
  {
    acronym: "APPROACH",
    name: "Ask for the plan first, code second",
    expansion:
      "Have the model output a numbered plan. Approve it. Then say “go”. Cuts wrong-direction loops at the source.",
    when: "Best when you don’t know the right solution yet.",
  },
  {
    acronym: "CARE",
    name: "Context · Action · Result · Examples",
    expansion:
      "Frame the bug report: what you saw, what you tried, what should happen, with a sample input.",
    when: "Best for bug fixes and incidents.",
  },
];

export function PromptDisciplineSection() {
  return (
    <SectionShell
      id="prompt-discipline"
      eyebrow="06.5 · Prompt as a cost lever"
      title={
        <>
          Same credit, <span className="gradient-text">2× the work</span>
        </>
      }
      intro={
        <>
          The tank from the previous slide can shrink to half size — same model, same task. The variable is{" "}
          <strong>prompt discipline</strong>. Teach this once and you save more credits than tweaking any budget.
        </>
      }
    >
      {/* Cost comparison cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-[var(--line)] bg-[rgba(255,90,90,0.05)] p-5">
          <div className="eyebrow !text-[#ff7b7b] mb-2">Same bug · vague prompt</div>
          <pre className="font-mono text-sm bg-black/30 rounded-md p-3 text-[var(--text-muted)] whitespace-pre-wrap">
fix the date parsing bug
          </pre>
          <ul className="mt-3 text-xs text-[var(--text-muted)] space-y-1">
            <li>· Agent re-reads the repo to guess context</li>
            <li>· Tries 2–3 wrong files before landing</li>
            <li>· Runs tests unnecessarily</li>
          </ul>
          <div className="mt-4 text-right">
            <span className="font-mono text-2xl font-bold text-[#ff7b7b]">~80 cr</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[rgba(56,193,114,0.05)] p-5">
          <div className="eyebrow !text-[var(--green)] mb-2">Same bug · TRACE prompt</div>
          <pre className="font-mono text-[11px] bg-black/30 rounded-md p-3 text-[var(--text-muted)] whitespace-pre-wrap leading-relaxed">
{`Task: Fix date parsing in src/utils/parseDate.ts
Reasoning: ISO 8601 w/o timezone returns NaN
Approach: Only modify parseDate(); skip tests
Constraints: Single file, no new deps, return null on invalid
Example: parseDate("2026-06-07") → Date,
         parseDate("oops") → null`}
          </pre>
          <div className="mt-4 text-right">
            <span className="font-mono text-2xl font-bold text-[var(--green)]">~18 cr</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-[var(--text-muted)] mb-4 text-center">
        <strong className="text-white">Same model. Same outcome. 77% cheaper.</strong> Across a team, this is bigger than any ULB change.
      </p>

      {/* Three templates */}
      <div className="grid md:grid-cols-3 gap-3">
        {TEMPLATES.map((t) => (
          <div
            key={t.acronym}
            className="rounded-xl border border-[var(--line)] bg-[rgba(13,17,23,0.5)] p-4"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-lg font-bold text-[var(--blue)]">{t.acronym}</span>
            </div>
            <div className="text-xs text-white font-semibold mb-2">{t.name}</div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-2">{t.expansion}</p>
            <p className="text-[11px] text-[var(--text-muted)] italic">{t.when}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 p-4 rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.5)]">
        <p className="text-sm">
          <strong className="text-white">Plus one rule:</strong>{" "}
          <span className="text-[var(--text-muted)]">
            talk to the agent like a junior dev. <em>“Only modify auth.ts. Don’t touch other files. Don’t run tests.”</em>{" "}
            Constraints = fewer turns = fewer credits. Ambiguity is the most expensive token you’ll never see.
          </span>
        </p>
      </div>
    </SectionShell>
  );
}
