import { SectionShell } from "@/components/SectionShell";
import { CopilotPlayground } from "@/components/interactive/CopilotPlayground";

type Props = { part?: "a" | "b" };

const TITLE = <>Live <span className="gradient-text">Copilot playground</span></>;

export function PlaygroundSection({ part = "a" }: Props = {}) {
  if (part === "b") {
    return (
      <SectionShell id="playground" eyebrow="13 · Send a prompt" title={TITLE} compact>
        <CopilotPlayground />
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="playground"
      eyebrow="13 · Demo · Try a real prompt"
      title={TITLE}
      intro={
        <>
          Pick a <strong>wallet preset</strong> (small demo slice, or a real Business / Enterprise pool — standard or promo), pick a <strong>model</strong>, pick a <strong>prompt</strong>, click <strong>Send</strong>. The exact token-to-credit math runs and the deduction lands on the wallet, just like the real meter.
        </>
      }
    >
      <div className="rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.55)] p-5 mb-4 text-sm leading-relaxed">
        <div className="eyebrow mb-2">How the AI credit charge is calculated</div>
        <p className="text-[var(--text-muted)] mb-3">
          Every prompt below has a realistic token footprint for that kind of
          interaction (a chat turn is ~1.5K tokens; a cloud agent task is ~80K).
          When you click Send the demo runs the documented GitHub formula:
        </p>
        <div className="formula-block">
<span className="c">{"// step 1 — token cost in USD"}</span>{"\n"}
<span className="k">USD</span> <span className="o">=</span> ( <span className="k">input_tokens</span>  <span className="o">×</span> <span className="v">$/1M_in</span>
        <span className="o"> + </span>
        <span className="k">output_tokens</span> <span className="o">×</span> <span className="v">$/1M_out</span> ) <span className="o">/</span> <span className="v">1,000,000</span>{"\n\n"}
<span className="c">{"// step 2 — convert to AI credits  (fixed: 1 credit = $0.01 USD)"}</span>{"\n"}
<span className="k">AI Credits</span> <span className="o">=</span> <span className="k">USD</span> <span className="o">×</span> <span className="v">100</span>
        </div>
        <p className="text-[var(--text-muted)] mt-3 text-xs">
          <strong className="text-white">About the per-model rates:</strong> GitHub has
          not published the per-model AI-credit conversion table publicly —
          only the fixed 1 credit = $0.01 USD ratio. To make the demo meaningful
          the per-1M token rates shown come from each vendor&apos;s public list
          price (e.g. Anthropic, OpenAI, Google) and are{" "}
          <em>illustrative placeholders</em>. The shape of the math (and
          therefore the relative cost of each model) is correct; the absolute
          numbers will move slightly when GitHub publishes the official rate
          sheet.
        </p>
      </div>
    </SectionShell>
  );
}
