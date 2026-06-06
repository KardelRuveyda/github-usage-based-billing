"use client";

import { useState, useRef, useEffect } from "react";
import { MODELS } from "@/lib/models";

/**
 * CopilotPlayground — fake VS Code "Copilot Chat" with a real per-user wallet.
 *
 * The user:
 *   1. picks a model
 *   2. picks (or types) a prompt — different presets have different token
 *      footprints
 *   3. clicks Send → we animate a "thinking" pause, draw the response,
 *      compute exact tokens × model rate → USD → AI credits, deduct from
 *      the wallet, and show the breakdown.
 *
 * Wallet starts at 200 credits (a deliberately small personal budget so the
 * customer can feel how quickly an agent run drains it). When the wallet
 * crosses 0, requests enter the "metered" phase and are tinted red.
 */

type Prompt = {
  id: string;
  label: string;
  user: string;
  /** Rough token footprint for this kind of interaction. */
  inputTokens: number;
  outputTokens: number;
  /** Canned reply (kept short — only the meter is the point). */
  reply: string;
  kind: "Chat" | "CLI" | "Agent" | "Spaces" | "Review";
};

const PROMPTS: Prompt[] = [
  {
    id: "explain",
    label: "Explain a small function",
    kind: "Chat",
    user: "Explain what `debounce()` does and when I should use it.",
    inputTokens:  600,
    outputTokens: 900,
    reply:
      "`debounce(fn, ms)` returns a wrapped function that only fires once the caller has been quiet for `ms` ms. " +
      "Use it for keystroke handlers, resize listeners, autosave — anything where the last event in a burst is the one that matters.",
  },
  {
    id: "unit-test",
    label: "Write a unit test",
    kind: "Chat",
    user: "Write a Jest unit test for the cart total reducer below…",
    inputTokens:  1_800,
    outputTokens: 2_400,
    reply:
      "Done. Added `cartTotal.test.ts` covering empty cart, single item, quantity > 1, and the 10% discount branch. All 4 cases assert exact numeric totals.",
  },
  {
    id: "review",
    label: "Review a pull request",
    kind: "Review",
    user: "Review PR #482 — focus on the auth changes.",
    inputTokens:  6_000,
    outputTokens: 2_200,
    reply:
      "Three findings: (1) the JWT now uses HS256 with a short secret — please rotate to RS256; (2) the `/refresh` route skips CSRF; (3) `verifyToken()` swallows JwtMalformedError. Code style is otherwise consistent.",
  },
  {
    id: "spaces",
    label: "Ask a Spaces question",
    kind: "Spaces",
    user: "Across our handbook, what's our policy on data retention for customer logs?",
    inputTokens:  8_500,
    outputTokens: 1_300,
    reply:
      "Customer logs are retained for 30 days hot and 12 months cold, per `data-handling.md`. Anything containing PII is purged on request within 7 business days (see GDPR runbook §4).",
  },
  {
    id: "agent",
    label: "Cloud agent: build a CRUD API",
    kind: "Agent",
    user: "Build me a Node + Express + Prisma CRUD API for `Project` (id, name, ownerId, createdAt) including tests and a README.",
    inputTokens:  18_000,
    outputTokens: 62_000,
    reply:
      "Created 9 files (routes, controller, service, prisma schema, 14 tests, README, openapi.yaml). All tests pass locally. Ready to push to a draft PR.",
  },
];

/**
 * Wallet presets — let the developer pick a wallet size that matches a real
 * plan, so they can see how quickly Personal/Business/Enterprise pools behave
 * with the same prompts.
 *
 * Numbers come from src/lib/models.ts PLANS (standard + promotional).
 */
type WalletPreset = {
  id: string;
  label: string;
  sub: string;
  credits: number;
};

const WALLET_PRESETS: WalletPreset[] = [
  { id: "demo",      label: "Personal demo slice",        sub: "~5 prompts before metered — feel exhaustion fast", credits: 200    },
  { id: "biz-std",   label: "Copilot Business · standard", sub: "$19/seat · 1,900 cr/user/month pool",              credits: 1_900  },
  { id: "biz-promo", label: "Copilot Business · promo",    sub: "$19/seat · promo Jun 1–Sep 1, 2026 — ~4,900 cr",   credits: 4_900  },
  { id: "ent-std",   label: "Copilot Enterprise · standard", sub: "$39/seat · 3,900 cr/user/month pool",            credits: 3_900  },
  { id: "ent-promo", label: "Copilot Enterprise · promo",  sub: "$39/seat · promo Jun 1–Sep 1, 2026 — ~10,900 cr", credits: 10_900 },
];

type Turn = {
  id: number;
  prompt: Prompt;
  modelName: string;
  inputRate: number;   // USD per 1M input tokens (snapshot at send time)
  outputRate: number;  // USD per 1M output tokens
  inputUsd: number;    // tokens × rate / 1M
  outputUsd: number;
  usd: number;
  credits: number;
  state: "thinking" | "done";
  metered: boolean;
};

export function CopilotPlayground() {
  const [modelId, setModelId]     = useState("claude-sonnet-4");
  const [promptId, setPromptId]   = useState("explain");
  const [walletId, setWalletId]   = useState("demo");
  const wallet = WALLET_PRESETS.find((w) => w.id === walletId)!;
  const [balance, setBalance]     = useState(wallet.credits);
  const [history, setHistory]     = useState<Turn[]>([]);
  const [busy, setBusy]           = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  const turnCounter = useRef(0);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  const model = MODELS.find((m) => m.id === modelId)!;
  const prompt = PROMPTS.find((p) => p.id === promptId)!;

  const previewInputUsd  = (prompt.inputTokens  / 1e6) * model.inputPer1M;
  const previewOutputUsd = (prompt.outputTokens / 1e6) * model.outputPer1M;
  const previewUsd       = previewInputUsd + previewOutputUsd;
  const previewCredits   = previewUsd * 100;

  const send = () => {
    if (busy) return;
    setBusy(true);

    const willBeMetered = balance - previewCredits < 0;
    const newTurn: Turn = {
      id: ++turnCounter.current,
      prompt,
      modelName:  model.name,
      inputRate:  model.inputPer1M,
      outputRate: model.outputPer1M,
      inputUsd:   previewInputUsd,
      outputUsd:  previewOutputUsd,
      usd:        previewUsd,
      credits:    previewCredits,
      state:      "thinking",
      metered:    willBeMetered,
    };
    setHistory((h) => [...h, newTurn]);

    // Simulate model latency
    setTimeout(() => {
      setBalance((b) => b - previewCredits);
      setHistory((h) =>
        h.map((t) => (t.id === newTurn.id ? { ...t, state: "done" } : t))
      );
      setBusy(false);
    }, 850);
  };

  const reset = () => {
    setBalance(wallet.credits);
    setHistory([]);
    turnCounter.current = 0;
  };

  // Switching wallet preset wipes history so the comparison is clean.
  const onWalletChange = (id: string) => {
    const next = WALLET_PRESETS.find((w) => w.id === id)!;
    setWalletId(id);
    setBalance(next.credits);
    setHistory([]);
    turnCounter.current = 0;
  };

  const pct = Math.max(0, Math.min(100, (balance / wallet.credits) * 100));
  const overdraft = balance < 0;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* CHAT */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-0)] overflow-hidden shadow-2xl">
        <div className="px-5 py-3 border-b border-[var(--line)] flex items-center gap-3 bg-[#0a0d11]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 tiny font-mono">GitHub Copilot Chat — your-org / acme-app</span>
          <span className="ml-auto tier-pill standard">{model.name}</span>
        </div>

        <div
          ref={transcriptRef}
          className="p-5 h-[420px] overflow-y-auto flex flex-col gap-4 text-sm"
        >
          {history.length === 0 ? (
            <div className="m-auto text-center text-[var(--text-muted)]">
              <div className="text-3xl mb-2">⌨️</div>
              Pick a prompt on the right and click <strong>Send</strong> to watch
              your wallet move in real time.
            </div>
          ) : (
            history.map((t) => (
              <div key={t.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-2)] border border-[var(--line)] flex items-center justify-center text-xs font-bold shrink-0">
                    Y
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">you · {t.prompt.kind}</div>
                    <div className="text-[var(--text)]">{t.prompt.user}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[rgba(137,87,229,0.2)] border border-[var(--purple)] flex items-center justify-center text-xs shrink-0">
                    🤖
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[var(--text-muted)] mb-1">
                      copilot · {t.modelName}
                    </div>
                    {t.state === "thinking" ? (
                      <div className="text-[var(--text-muted)] italic">…thinking…</div>
                    ) : (
                      <>
                        <div>{t.prompt.reply}</div>

                        {/* Receipt: every step of the credit calculation. */}
                        <div
                          className={`mt-3 rounded-lg border overflow-hidden ${
                            t.metered
                              ? "border-[rgba(248,81,73,0.4)]"
                              : "border-[var(--line)]"
                          }`}
                        >
                          <div className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold flex items-center justify-between ${
                            t.metered
                              ? "bg-[rgba(248,81,73,0.15)] text-[var(--red)]"
                              : "bg-[var(--bg-1)] text-[var(--text-muted)]"
                          }`}>
                            <span>AI credit receipt</span>
                            <span>{t.metered ? "metered (paid)" : "drawn from wallet"}</span>
                          </div>
                          <div className="px-3 py-2 font-mono text-[11px] leading-relaxed bg-[var(--bg-0)] space-y-0.5">
                            <div className="text-[var(--text-muted)]">
                              <span className="text-[var(--blue)]">input</span>:{" "}
                              {t.prompt.inputTokens.toLocaleString()} tok × ${t.inputRate.toFixed(2)}/1M
                              {" "}={" "}
                              <span className="text-white">${t.inputUsd.toFixed(5)}</span>
                            </div>
                            <div className="text-[var(--text-muted)]">
                              <span className="text-[var(--green)]">output</span>:{" "}
                              {t.prompt.outputTokens.toLocaleString()} tok × ${t.outputRate.toFixed(2)}/1M
                              {" "}={" "}
                              <span className="text-white">${t.outputUsd.toFixed(5)}</span>
                            </div>
                            <div className="text-[var(--text-muted)] border-t border-[var(--line)] pt-1 mt-1">
                              total = <span className="text-white">${t.usd.toFixed(5)} USD</span>
                              {" × "}100
                              {" = "}
                              <span className={`font-bold ${t.metered ? "text-[var(--red)]" : "text-[var(--purple)]"}`}>
                                {t.credits.toFixed(2)} AI credits
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[var(--line)] p-4 bg-[#0a0d11]">
          <div className="flex flex-wrap gap-2 mb-3">
            {PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPromptId(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  promptId === p.id
                    ? "border-[var(--blue)] bg-[rgba(88,166,255,0.15)] text-white"
                    : "border-[var(--line)] text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--bg-1)] px-3 py-2 text-sm font-mono text-[var(--text-muted)]">
              {prompt.user}
            </div>
            <button
              onClick={send}
              disabled={busy}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: "var(--accent-gradient)" }}
            >
              {busy ? "…" : "Send →"}
            </button>
          </div>
          <p className="tiny mt-2">
            About to charge{" "}
            <span className="font-mono font-bold text-[var(--blue)]">
              {previewCredits.toFixed(2)} cr
            </span>{" "}
            on <span className="font-mono">{model.name}</span>
            {" — "}
            <span className="font-mono">
              {prompt.inputTokens.toLocaleString()} in × ${model.inputPer1M.toFixed(2)}
              {" + "}
              {prompt.outputTokens.toLocaleString()} out × ${model.outputPer1M.toFixed(2)} /1M
            </span>
            {" = "}
            <span className="font-mono">${previewUsd.toFixed(4)} → ×100</span>
          </p>
        </div>
      </div>

      {/* WALLET */}
      <div className="space-y-4">
        <div
          className={`rounded-2xl p-6 border-2 transition-colors ${
            overdraft
              ? "border-[var(--red)] bg-[rgba(248,81,73,0.08)]"
              : "border-[var(--green)] bg-[rgba(63,185,80,0.06)]"
          }`}
        >
          <span className="tiny uppercase">Your AI credit wallet</span>
          <div className={`text-5xl font-mono font-bold mt-2 ${overdraft ? "text-[var(--red)]" : "gradient-text"}`}>
            {balance.toFixed(2)}
          </div>
          <div className="tiny mt-1">of {wallet.credits.toLocaleString()} starting credits · <span className="text-white/80">{wallet.label}</span></div>

          <div className="w-full h-3 bg-[var(--bg-2)] rounded-full overflow-hidden mt-4">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background:
                  pct > 50 ? "var(--green)" : pct > 15 ? "var(--yellow)" : "var(--red)",
              }}
            />
          </div>

          {overdraft && (
            <div className="mt-4 text-sm text-[var(--red)]">
              ▲ Wallet exhausted. New requests now hit the <strong>metered phase</strong>{" "}
              at $0.01 / credit (or get blocked if the entity has the hard-stop on).
            </div>
          )}
        </div>

        <div className=" p-4 space-y-3 rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.55)]">
          <div>
            <div className="eyebrow mb-1">Wallet preset</div>
            <select
              value={walletId}
              onChange={(e) => onWalletChange(e.target.value)}
              className="w-full bg-[var(--bg-1)] border border-[var(--line)] rounded-lg px-3 py-1.5 font-mono text-xs"
            >
              {WALLET_PRESETS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label} — {w.credits.toLocaleString()} cr
                </option>
              ))}
            </select>
            <p className="tiny mt-1.5">{wallet.sub}</p>
          </div>

          <div>
            <div className="eyebrow mb-1">Model</div>
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full bg-[var(--bg-1)] border border-[var(--line)] rounded-lg px-3 py-1.5 font-mono text-xs"
            >
              {(["Lightweight", "Standard", "Premium"] as const).map((tier) => (
                <optgroup key={tier} label={`${tier} tier`}>
                  {MODELS.filter((m) => m.tier === tier).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} · {m.vendor} — ${m.inputPer1M}/in · ${m.outputPer1M}/out per 1M
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="mt-2 rounded-lg border border-[var(--line)] bg-[var(--bg-0)] px-3 py-2 font-mono text-[11px] leading-relaxed">
              <div className="text-[var(--text-muted)] flex justify-between">
                <span><span className="text-[var(--blue)]">input</span> per 1M tok</span>
                <span className="text-white">${model.inputPer1M.toFixed(2)}</span>
              </div>
              <div className="text-[var(--text-muted)] flex justify-between">
                <span><span className="text-[var(--green)]">output</span> per 1M tok</span>
                <span className="text-white">${model.outputPer1M.toFixed(2)}</span>
              </div>
              <div className="text-[var(--text-muted)] flex justify-between">
                <span>cached input</span>
                <span className="text-white">${model.cachedPer1M.toFixed(3)}</span>
              </div>
            </div>
            <p className="tiny mt-2">
              Same prompt, different model = wildly different cost. Try the agent prompt on Claude Opus 4 vs GPT-4o mini.
            </p>
          </div>
        </div>

        <button
          onClick={reset}
          className="w-full px-4 py-2 rounded-lg text-xs border border-[var(--line)] text-[var(--text-muted)] hover:text-white hover:bg-white/5"
        >
          ↺ Reset wallet
        </button>

        <p className="tiny">
          Token counts are realistic averages per prompt class; cost uses the real formula: tokens × rate → USD × 100 → AI credits.
        </p>
      </div>
    </div>
  );
}
