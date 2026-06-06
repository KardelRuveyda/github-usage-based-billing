"use client";

import { useMemo, useState } from "react";
import { MODELS, USD_TO_CREDITS } from "@/lib/models";

const fmt = (n: number, d = 2) =>
  n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

export function ModelCalculator() {
  const [inputT, setInputT]   = useState(5000);
  const [outputT, setOutputT] = useState(5000);
  const [cacheT, setCacheT]   = useState(0);
  const [modelId, setModelId] = useState("claude-sonnet-4");

  const model = useMemo(() => MODELS.find((m) => m.id === modelId)!, [modelId]);

  const usdIn   = (inputT  / 1e6) * model.inputPer1M;
  const usdOut  = (outputT / 1e6) * model.outputPer1M;
  const usdCach = (cacheT  / 1e6) * model.cachedPer1M;
  const usd     = usdIn + usdOut + usdCach;
  const credits = usd * USD_TO_CREDITS;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="glass p-6">
        <Field label="Input tokens" value={inputT.toLocaleString()}>
          <input
            type="range"
            className="gh-range"
            min={0}
            max={50_000}
            step={500}
            value={inputT}
            onChange={(e) => setInputT(+e.target.value)}
          />
        </Field>

        <Field label="Output tokens" value={outputT.toLocaleString()}>
          <input
            type="range"
            className="gh-range"
            min={0}
            max={50_000}
            step={500}
            value={outputT}
            onChange={(e) => setOutputT(+e.target.value)}
          />
        </Field>

        <Field label="Cached input tokens" value={cacheT.toLocaleString()}>
          <input
            type="range"
            className="gh-range"
            min={0}
            max={50_000}
            step={500}
            value={cacheT}
            onChange={(e) => setCacheT(+e.target.value)}
          />
        </Field>

        <label className="block mt-4">
          <span className="tiny uppercase block mb-2">Model</span>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full bg-[var(--bg-1)] border border-[var(--line)] rounded-lg px-3 py-2 font-mono text-sm"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.vendor} · {m.name} ({m.tier})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="bg-[rgba(13,17,23,0.65)] border border-[var(--line)] rounded-2xl p-6 flex flex-col gap-3 font-mono">
        <Line label="Input cost"  value={`$${fmt(usdIn, 5)}`} />
        <Line label="Output cost" value={`$${fmt(usdOut, 5)}`} />
        <Line label="Cached cost" value={`$${fmt(usdCach, 5)}`} />
        <div className="flex justify-between items-baseline border-t border-dashed border-[var(--line)] pt-3 text-base">
          <span className="text-[var(--text-muted)]">Total USD</span>
          <span className="text-[var(--green)] font-bold text-xl">${fmt(usd, 4)}</span>
        </div>
        <div className="text-center pt-3">
          <div className="text-5xl font-bold gradient-text">{fmt(credits, 2)}</div>
          <div className="tiny mt-1">AI Credits drawn down</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <span className="tiny uppercase">{label}</span>
        <span className="text-[var(--blue)] font-mono font-bold">{value}</span>
      </div>
      {children}
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm text-[var(--text-muted)]">
      <span>{label}</span>
      <span className="text-[var(--green)]">{value}</span>
    </div>
  );
}
