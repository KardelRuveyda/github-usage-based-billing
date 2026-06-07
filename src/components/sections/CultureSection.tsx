import { SectionShell } from "../SectionShell";

const PILLARS: Array<{
  emoji: string;
  title: string;
  tag: string;
  body: string;
  example: { label: string; lines: string[] };
}> = [
  {
    emoji: "🤖",
    title: "Custom agents & skills",
    tag: "Standardize the prompt",
    body:
      "Instead of asking “please review this PR”, expose a fixed agent — same instructions, same model, same token budget. Every dev gets the same quality at the same cost. Skills carry recurring domain context (auth pattern, error handling) so you don’t pay to re-establish it every session.",
    example: {
      label: "Example",
      lines: [
        "@security-reviewer",
        "  model: claude-sonnet-4",
        "  max_tokens: 4000",
        "  skill: company-auth-conventions",
      ],
    },
  },
  {
    emoji: "🧹",
    title: "Session hygiene",
    tag: "Standardize the context",
    body:
      "Long chats accumulate context that gets re-sent on every turn. `/clear` resets it to zero — instant savings on the next message. `/chronicles` audits past sessions so you can find the 1–2 patterns that drained the pool and stop them before next month.",
    example: {
      label: "Two commands",
      lines: [
        "/clear        # reset token counter to 0",
        "/chronicles   # list past sessions by credit spend",
      ],
    },
  },
  {
    emoji: "🪜",
    title: "Plan → agent handoff",
    tag: "Standardize the model choice",
    body:
      "Use the expensive model (Opus) only to produce a small plan (~$0.05). Hand the plan to a cheap model (Sonnet/Haiku) to execute (~$0.20). Total ~$0.25 vs ~$1.50 of pure-Opus runs — 3–4× cheaper, same outcome. Opus is best at planning, not at typing.",
    example: {
      label: "Pattern",
      lines: [
        "1. Opus → outline steps (small output)",
        "2. Sonnet → implement each step",
        "3. Sonnet → write the tests",
      ],
    },
  },
];

export function CultureSection() {
  return (
    <SectionShell
      id="culture"
      eyebrow="11.5 · Repeatable efficiency"
      title={
        <>
          Custom agents, skills <span className="gradient-text">& session hygiene</span>
        </>
      }
      intro={
        <>
          Rollout steps cap your spend. <strong>Culture</strong> shrinks it. Three repeatable patterns that scale as the team grows — and keep the pool forecast honest month after month.
        </>
      }
    >
      <div className="grid md:grid-cols-3 gap-4 mb-5">
        {PILLARS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.5)] p-5 flex flex-col"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl leading-none">{p.emoji}</span>
              <div>
                <div className="font-semibold text-white text-sm leading-tight">{p.title}</div>
                <div className="eyebrow !text-[var(--blue)] mt-0.5">{p.tag}</div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-3 flex-1">{p.body}</p>
            <div className="rounded-md border border-[var(--line)]/70 bg-black/30 p-2.5">
              <div className="eyebrow mb-1 !text-[var(--text-muted)]">{p.example.label}</div>
              <pre className="font-mono text-[11px] text-white whitespace-pre-wrap leading-relaxed">
                {p.example.lines.join("\n")}
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center p-4 rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.5)]">
        <p className="text-sm">
          <strong className="text-white">The mental model:</strong>{" "}
          <span className="text-[var(--text-muted)]">
            Budgets and toggles set the <em>ceiling</em>. Custom agents, <code className="font-mono text-xs">/clear</code>, and plan→handoff lower the <em>floor</em>. Both together = the pool estimate stops being a guess.
          </span>
        </p>
        <div className="text-xs text-[var(--text-muted)] whitespace-nowrap">
          <div>
            Expected impact: <strong className="text-[var(--green)]">~30–50%</strong>
          </div>
          <div className="opacity-70">credit reduction on agent-heavy teams</div>
        </div>
      </div>
    </SectionShell>
  );
}
