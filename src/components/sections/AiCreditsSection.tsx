import { SectionShell } from "../SectionShell";
import { Analogy } from "../analogies/Analogy";
import { TaxiMeterViz } from "../analogies/TaxiMeterViz";

type Props = { part?: "a" | "b" };

const TITLE = <>Tokens &middot; USD &middot; <span className="gradient-text">AI Credits</span></>;

export function AiCreditsSection({ part = "a" }: Props = {}) {
  if (part === "a") {
    return (
      <SectionShell
        id="ai-credits"
        eyebrow="03 · The currency"
        title={TITLE}
        intro="Tokens measure work, dollars measure cost, AI credits measure both — at a fixed conversion. Every billable interaction follows the same two-step pipeline."
      >
        <Analogy
          emoji="🚕"
          title="Taxi meter"
          subtitle="Distance → fare → paid with prepaid receipts — three steps, in order"
          visual={<TaxiMeterViz />}
          mapping={[
            { from: "Distance you travel",                 to: "Token count (input + output)" },
            { from: "The taxi’s rate (day / night tariff)",  to: "Model’s $/1M token rate" },
            { from: "Raw fare ticking up on the meter",    to: "Intermediate USD amount" },
            { from: "Prepaid receipts you bought earlier", to: "AI credit (1 receipt = $0.01)" },
          ]}
          footnote="Distance → dollars → receipts. Three steps. No hidden multiplier, no surprise formula in between."
        />
      </SectionShell>
    );
  }

  return (
    <SectionShell id="ai-credits" eyebrow="03 · The formula" title={TITLE} compact>
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <Stage color="var(--blue)"   label="TOKENS"     value="consumed"   sub="input · output · cached" />
        <Stage color="var(--yellow)" label="USD"        value="summed"     sub="model-specific token rates" />
        <Stage color="var(--green)"  label="AI CREDITS" value="drawn down" sub="$0.01 per credit · fixed" />
      </div>

      <div className="formula-block">
<span className="c">{"// step 1 — sum the dollar cost of every token bucket"}</span>{"\n"}
<span className="k">USD</span> <span className="o">=</span> ( <span className="k">input_tokens</span>  <span className="o">×</span> <span className="v">$/1M_in</span>{"\n"}
        <span className="o">+</span> <span className="k">output_tokens</span> <span className="o">×</span> <span className="v">$/1M_out</span>{"\n"}
        <span className="o">+</span> <span className="k">cached_tokens</span> <span className="o">×</span> <span className="v">$/1M_cached</span> ) <span className="o">/</span> <span className="v">1,000,000</span>{"\n\n"}
<span className="c">{"// step 2 — convert dollars to AI credits  (fixed: 1 credit = $0.01 USD)"}</span>{"\n"}
<span className="k">AI Credits</span> <span className="o">=</span> <span className="k">USD</span> <span className="o">×</span> <span className="v">100</span>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Fact label="Conversion rate"      value="1 credit = $0.01 USD" hint="Fixed. The same on every model." />
        <Fact label="Pooling level"        value="Billing entity"        hint="Credits from all seats share one pool." />
        <Fact label="Data-resident / FedRAMP" value="+10% multiplier" hint="Token cost increases by 10% in regional / regulated deployments." />
      </div>
    </SectionShell>
  );
}

function Stage({ color, label, value, sub }: { color: string; label: string; value: string; sub: string }) {
  return (
    <div
      className="rounded-2xl border-2 p-6 bg-[var(--bg-1)] text-center"
      style={{ borderColor: color }}
    >
      <div className="font-mono text-xs tracking-[0.18em] font-bold mb-3" style={{ color }}>{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-[var(--text-muted)] mt-2">{sub}</div>
    </div>
  );
}

function Fact({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="glass p-5">
      <div className="tiny uppercase mb-2">{label}</div>
      <div className="font-mono text-lg font-bold gradient-text">{value}</div>
      <p className="tiny mt-2">{hint}</p>
    </div>
  );
}
