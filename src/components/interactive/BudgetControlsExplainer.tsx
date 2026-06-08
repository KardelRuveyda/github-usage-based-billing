"use client";

import { useState } from "react";

/**
 * BudgetControlsExplainer — visualises the 4-layer budget check that GitHub
 * runs on every billable Copilot interaction (post-quota / overage phase):
 *
 *  1. User-level (universal + per-user)  — checked FIRST, in both pool and metered phases
 *  2. Shared pool                        — included credits across the entity
 *  3. Cost center / Org / Enterprise     — metered phase only; checked independently
 *  4. "Stop usage when limit reached"    — must be ON to enforce 3
 *
 * "Lowest remaining headroom wins" — if any layer is empty, the request stops.
 * Note: CC ≠ Org. A user is either in a CC (billing group) or governed by Org
 * (org boundary). Enterprise sits above both, with an "Exclude CC usage" toggle
 * that lets CC teams keep running after the enterprise cap blocks everyone else.
 */

type Layer = {
  id: string;
  title: string;
  applies: string;
  hardStop: boolean;
  note: string;
};

const LAYERS: Layer[] = [
  {
    id: "user",
    title: "User-level budget (ULB)",
    applies: "Pool AND metered phase",
    hardStop: true,
    note: "Universal default for everyone, optionally overridden per user. Always blocks — no setting required. Runs FIRST: can block even when the pool still has free credits.",
  },
  {
    id: "pool",
    title: "Included AI credit pool",
    applies: "Pool phase only",
    hardStop: false,
    note: "Sum of all licensed seats. When this is depleted, requests move into metered (paid) mode at $0.01 / credit.",
  },
  {
    id: "cost-center",
    title: "Cost center / Org budget",
    applies: "Metered phase only",
    hardStop: false,
    note: "If the user is in a CC (billing group), the CC budget governs them. Otherwise the Org budget (org boundary) applies. Checked independently — CC ≠ Org.",
  },
  {
    id: "enterprise",
    title: "Enterprise budget",
    applies: "Metered phase only",
    hardStop: false,
    note: "Master cap. Soft by default — flip 'Stop usage when budget limit is reached' to make it a hard stop. Optional 'Exclude CC usage' toggle bypasses Ent for CC users.",
  },
];

export function BudgetControlsExplainer() {
  const [stopUsage, setStopUsage] = useState(true);
  const [request, setRequest] = useState<"in-pool" | "metered">("metered");

  const layerActive = (id: string) => {
    if (id === "user") return true;
    if (id === "pool") return request === "in-pool";
    if (id === "cost-center" || id === "enterprise") return request === "metered";
    return false;
  };

  const layerEnforces = (id: string) => {
    if (id === "user" || id === "pool") return true;
    return stopUsage;
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
      <div className="glass p-6">
        <span className="eyebrow">Toggle the scenario</span>
        <h3 className="text-xl font-semibold mt-2 mb-3">Simulate a single Copilot request</h3>

        {/* Phase explainer — what "pool" vs "metered" actually means */}
        <div className="mb-4 rounded-xl border border-[var(--line)] bg-[rgba(13,17,23,0.45)] p-3 text-xs leading-relaxed">
          <div className="eyebrow mb-1">What is a "phase"?</div>
          <p className="text-[var(--text-muted)]">
            Every Copilot request lives in one of two phases.
          </p>
          <ul className="mt-2 space-y-1.5 text-[var(--text-muted)]">
            <li>
              <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ background: "var(--green)" }} />
              <strong className="text-white">Pool phase</strong> — the included AI credit pool still has credits left. Requests draw from it. <strong>No extra charge.</strong>
            </li>
            <li>
              <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle" style={{ background: "var(--yellow)" }} />
              <strong className="text-white">Metered phase</strong> — the pool is exhausted. Every credit now costs $0.01 (just like overage minutes on a phone plan).
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="tiny uppercase block mb-2">Pretend this request lands during…</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "in-pool", label: "Pool phase", sub: "pool still has credits" },
                { id: "metered", label: "Metered phase", sub: "pool empty · $0.01/cr" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRequest(opt.id as "in-pool" | "metered")}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                    request === opt.id
                      ? "border-[var(--purple)] bg-[rgba(137,87,229,0.15)]"
                      : "border-[var(--line)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <div className="font-semibold">{opt.label}</div>
                  <div className="tiny mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={stopUsage}
              onChange={(e) => setStopUsage(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[var(--purple)]"
            />
            <span>
              <span className="font-semibold">Stop usage when budget limit is reached</span>
              <p className="tiny mt-1">
                Off by default. Required to make cost-center & enterprise budgets
                act as hard stops instead of soft alerts.
              </p>
            </span>
          </label>
        </div>

        <div className="mt-6 p-4 rounded-xl border border-[var(--line)] bg-[rgba(13,17,23,0.4)] text-sm">
          <strong>Rule of thumb:</strong> lowest remaining headroom wins.
          GitHub stops the request the moment any active layer is empty.
        </div>
      </div>

      <div className="space-y-3">
        {LAYERS.map((l, i) => {
          const active = layerActive(l.id);
          const enforces = layerEnforces(l.id);
          return (
            <div
              key={l.id}
              className={`relative p-5 rounded-2xl border transition-all ${
                active
                  ? "border-[var(--purple)] bg-[rgba(137,87,229,0.08)]"
                  : "border-[var(--line)] bg-[rgba(13,17,23,0.4)] opacity-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-[var(--bg-2)] border border-[var(--line)]">
                  Check {i + 1}
                </span>
                <h4 className="font-semibold">{l.title}</h4>
                <span
                  className={`ml-auto text-xs font-mono px-2 py-1 rounded-md ${
                    active && enforces
                      ? "bg-[rgba(63,185,80,0.15)] text-[var(--green)] border border-[rgba(63,185,80,0.4)]"
                      : active
                        ? "bg-[rgba(248,81,73,0.12)] text-[var(--red)] border border-[rgba(248,81,73,0.4)]"
                        : "bg-[var(--bg-2)] text-[var(--text-muted)] border border-[var(--line)]"
                  }`}
                >
                  {!active ? "skipped" : enforces ? l.hardStop ? "always enforces" : "enforces" : "soft (alert only)"}
                </span>
              </div>
              <p className="tiny mb-1 uppercase">{l.applies}</p>
              <p className="text-sm text-[var(--text-muted)]">{l.note}</p>
            </div>
          );
        })}

        {/* Surprising-scenario callout — drawn from the 20-path GBB pipeline tool */}
        <div className="mt-2 p-5 rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.55)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="eyebrow">Four scenarios that surprise admins</span>
          </div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <strong className="text-[var(--red)]">ULB exhausted, pool still has free credits</strong>{" "}
              — user is blocked anyway. ULB tracks <em>total</em> usage and runs in every phase.
            </li>
            <li>
              <strong className="text-[var(--yellow)]">No budgets + pool empty</strong>{" "}
              — bill grows with no cap. Riskiest config. Always set at least an enterprise spending limit.
            </li>
            <li>
              <strong className="text-[var(--purple)]">Ent exhausted with “Exclude CC usage” ON</strong>{" "}
              — CC users keep running (governed by CC budget); non-CC users are blocked.
            </li>
            <li>
              <strong className="text-[var(--green)]">CC user · all budgets pass</strong>{" "}
              — Org and Ent are <em>not consulted</em> for CC members; CC is their cap.
            </li>
          </ul>
          <p className="tiny mt-3 text-[var(--text-muted)]">
            Pipeline order: Request → <strong>ULB</strong> → Pool → (in CC? → CC) <em>or</em> Org → Ent → Outcome. Each gate is checked independently; most-restrictive wins.
          </p>
        </div>
      </div>
    </div>
  );
}
