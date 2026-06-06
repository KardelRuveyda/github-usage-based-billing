"use client";

import { useMemo, useState } from "react";
import { MODELS } from "@/lib/models";

/**
 * ScenarioBuilder — answers "what will this actually cost me per user / month?"
 * for the three real customer topologies, then lets the user dial the inputs.
 *
 *   1. Pure Business        — 1,900 cr / seat included
 *   2. Pure Enterprise      — 3,900 cr / seat included
 *   3. Enterprise contract, Business-only orgs
 *      (Enterprise license is in place but no Enterprise-tier org exists,
 *      so users actually consume against the Business pool — Enterprise
 *      benefits never kick in)
 *   4. Mixed estate — a slider splits seats between Business & Enterprise
 */

type ScenarioId = "biz" | "ent" | "ent-as-biz" | "mixed";

type Profile = "light" | "medium" | "heavy";

const PROFILE_TOKENS: Record<Profile, number> = {
  light:  150_000,   // total billable tokens / user / month
  medium: 450_000,
  heavy:  1_400_000,
};

const PROFILE_LABELS: Record<Profile, string> = {
  light:  "Light · mostly chat, ~150K tokens/user/mo",
  medium: "Medium · chat + occasional agent, ~450K tokens/user/mo",
  heavy:  "Heavy · daily agent + Spaces, ~1.4M tokens/user/mo",
};

const SCENARIOS: { id: ScenarioId; title: string; desc: string }[] = [
  { id: "biz",        title: "Pure Copilot Business",                       desc: "Every seat is a Copilot Business seat at $19/seat. Pool = 1,900 cr/seat." },
  { id: "ent",        title: "Pure Copilot Enterprise",                     desc: "Every seat is a Copilot Enterprise seat at $39/seat. Pool = 3,900 cr/seat." },
  { id: "ent-as-biz", title: "GitHub Enterprise Cloud + Copilot Business", desc: "You have a GitHub Enterprise Cloud platform contract but bought Copilot Business seats only (no Copilot Enterprise SKU). Only Copilot Business is billed for AI — $19/seat, 1,900 cr/seat pool. The platform Enterprise account is not charged for Copilot." },
  { id: "mixed",      title: "Mixed estate",                               desc: "Some teams on Copilot Business, others on Copilot Enterprise. Slider splits the seats." },
];

const BUSINESS_FEE = 19;
const ENTERPRISE_FEE = 39;
const BUSINESS_POOL = 1_900;
const ENTERPRISE_POOL = 3_900;

export function ScenarioBuilder() {
  const [scenario, setScenario]   = useState<ScenarioId>("ent-as-biz");
  const [seats, setSeats]         = useState(120);
  const [entShare, setEntShare]   = useState(40);   // % of seats on Enterprise (mixed only)
  const [profile, setProfile]     = useState<Profile>("medium");
  const [heavyPct, setHeavyPct]   = useState(25);   // % of users on "heavy" regardless of base profile
  const [modelId, setModelId]     = useState("claude-opus-4");

  const model = useMemo(() => MODELS.find((m) => m.id === modelId)!, [modelId]);

  const result = useMemo(() => {
    // Seat split & blended seat fee
    const entSeats = scenario === "ent"        ? seats
                   : scenario === "biz"        ? 0
                   : scenario === "ent-as-biz" ? 0  // GHEC platform, but Copilot seats are all Business
                   : Math.round(seats * (entShare / 100));
    const bizSeats = seats - entSeats;

    // ent-as-biz: only Copilot Business is billed. The GitHub Enterprise Cloud
    // platform contract is not charged for Copilot when no Copilot Enterprise
    // seats exist — so seat fee is $19 × seats, identical to pure Business.
    const seatFee =
      scenario === "ent-as-biz"
        ? BUSINESS_FEE * seats
        : ENTERPRISE_FEE * entSeats + BUSINESS_FEE * bizSeats;

    const poolPerSeat =
      scenario === "ent"          ? ENTERPRISE_POOL
      : scenario === "biz"        ? BUSINESS_POOL
      : scenario === "ent-as-biz" ? BUSINESS_POOL
      : // mixed: weighted average pool per seat
        (ENTERPRISE_POOL * entSeats + BUSINESS_POOL * bizSeats) / Math.max(1, seats);

    const totalPool = poolPerSeat * seats;

    // Compute average tokens per user with heavy uplift
    const heavyUsers = Math.round(seats * (heavyPct / 100));
    const normalUsers = seats - heavyUsers;
    const tokensPerUser = PROFILE_TOKENS[profile];
    const totalTokens =
      normalUsers * tokensPerUser + heavyUsers * PROFILE_TOKENS.heavy;

    // 50/50 input/output split for simplicity
    const usdConsumed =
      (totalTokens * 0.5 / 1e6) * model.inputPer1M +
      (totalTokens * 0.5 / 1e6) * model.outputPer1M;
    const creditsConsumed = usdConsumed * 100;

    const overage = Math.max(0, creditsConsumed - totalPool);
    const overageUSD = overage * 0.01;

    const monthlyBill = seatFee + overageUSD;
    const perUser = monthlyBill / Math.max(1, seats);

    return {
      entSeats, bizSeats,
      seatFee,
      poolPerSeat,
      totalPool,
      creditsConsumed,
      overage,
      overageUSD,
      monthlyBill,
      perUser,
    };
  }, [scenario, seats, entShare, profile, heavyPct, model.inputPer1M, model.outputPer1M]);

  const selectedScenario = SCENARIOS.find((s) => s.id === scenario)!;

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
      {/* LEFT — controls */}
      <div className="glass p-4 space-y-4">
        <div>
          <span className="eyebrow block mb-3">1 · Pick a topology</span>
          <div className="grid sm:grid-cols-2 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                  scenario === s.id
                    ? "border-[var(--purple)] bg-[rgba(137,87,229,0.15)]"
                    : "border-[var(--line)] hover:border-[var(--text-muted)]"
                }`}
              >
                <span className="font-semibold block">{s.title}</span>
              </button>
            ))}
          </div>
          <p className="tiny mt-3">{selectedScenario.desc}</p>
          <p className="tiny mt-1 text-[var(--text-muted)] italic">
            → changes seat fee ($19 vs $39) and pool size (1,900 vs 3,900 cr/seat) on the right.
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">2 · Seats</span>
            <span className="font-mono font-bold text-[var(--blue)]">{seats}</span>
          </div>
          <input
            type="range"
            className="gh-range mt-2"
            min={5}
            max={1000}
            step={5}
            value={seats}
            onChange={(e) => setSeats(+e.target.value)}
          />
        </div>

        {scenario === "mixed" && (
          <div>
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">3 · % on Enterprise</span>
              <span className="font-mono font-bold text-[var(--purple)]">{entShare}%</span>
            </div>
            <input
              type="range"
              className="gh-range mt-2"
              min={0}
              max={100}
              step={5}
              value={entShare}
              onChange={(e) => setEntShare(+e.target.value)}
            />
            <p className="tiny mt-1">
              {result.entSeats} Enterprise + {result.bizSeats} Business seats.
            </p>
          </div>
        )}

        <div>
          <span className="eyebrow block mb-2">{scenario === "mixed" ? "4" : "3"} · Typical usage profile</span>
          <div className="grid grid-cols-3 gap-2">
            {(["light", "medium", "heavy"] as Profile[]).map((p) => (
              <button
                key={p}
                onClick={() => setProfile(p)}
                className={`px-2 py-2 rounded-lg border text-xs font-semibold uppercase transition-all ${
                  profile === p
                    ? "border-[var(--blue)] bg-[rgba(88,166,255,0.15)] text-white"
                    : "border-[var(--line)] text-[var(--text-muted)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <p className="tiny mt-2">{PROFILE_LABELS[profile]}</p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="eyebrow">{scenario === "mixed" ? "5" : "4"} · % heavy users</span>
            <span className="font-mono font-bold text-[var(--pink)]">{heavyPct}%</span>
          </div>
          <input
            type="range"
            className="gh-range mt-2"
            min={0}
            max={100}
            step={5}
            value={heavyPct}
            onChange={(e) => setHeavyPct(+e.target.value)}
          />
          <p className="tiny mt-1">
            What % of users are <strong>power users</strong> (agents, Spark)? They&apos;re forced to the heavy profile (~1.4M tokens) regardless of the base — a small heavy slice can dominate the bill.
          </p>
        </div>

        <div>
          <span className="eyebrow block mb-2">{scenario === "mixed" ? "6" : "5"} · Default model</span>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="w-full bg-[var(--bg-1)] border border-[var(--line)] rounded-lg px-3 py-2 font-mono text-sm"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.tier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RIGHT — result */}
      <div className="space-y-3">
        <div className="rounded-2xl border-2 border-[var(--purple)] bg-[rgba(137,87,229,0.08)] p-4">
          <span className="tiny uppercase">Estimated · per user / month</span>
          <div className="text-5xl font-mono font-bold gradient-text mt-1 leading-none">
            ${result.perUser.toFixed(2)}
          </div>
          <div className="tiny mt-1">
            ${result.monthlyBill.toLocaleString(undefined, { maximumFractionDigits: 0 })} total for {seats} seats
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat
            label="Seat fees"
            value={`$${result.seatFee.toLocaleString()}`}
            sub="fixed monthly"
            color="var(--blue)"
          />
          <Stat
            label="Pool used"
            value={`${Math.round((result.creditsConsumed / Math.max(1, result.totalPool)) * 100)}%`}
            sub={`${Math.round(result.creditsConsumed).toLocaleString()} / ${Math.round(result.totalPool).toLocaleString()} cr`}
            color={result.overage > 0 ? "var(--red)" : "var(--purple)"}
          />
          <Stat
            label="Metered overage"
            value={`$${result.overageUSD.toFixed(2)}`}
            sub={result.overage > 0 ? `${Math.round(result.overage).toLocaleString()} cr beyond pool` : "pool covers it"}
            color={result.overage > 0 ? "var(--red)" : "var(--green)"}
          />
        </div>

        <div className="glass p-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--text-muted)]">Pool consumption</span>
            <span className="font-mono">
              {Math.round(result.creditsConsumed).toLocaleString()} / {Math.round(result.totalPool).toLocaleString()} cr
            </span>
          </div>
          <div className="w-full h-3 bg-[var(--bg-2)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (result.creditsConsumed / Math.max(1, result.totalPool)) * 100)}%`,
                background:
                  result.overage > 0
                    ? "linear-gradient(90deg, var(--green), var(--red))"
                    : "var(--green)",
              }}
            />
          </div>
          <p className="tiny mt-2">
            Pool per seat: <strong>{Math.round(result.poolPerSeat).toLocaleString()} cr</strong>
            {scenario === "ent-as-biz" && (
              <>
                {" "}— Copilot Business pool; the GitHub Enterprise Cloud platform contract isn&apos;t charged for Copilot here.
              </>
            )}
            {result.overage === 0 && (
              <>
                {" — "}<span className="text-[var(--text-muted)] italic">pool covers it. Try a Premium model or push <strong>% heavy users</strong> higher to see overage.</span>
              </>
            )}
          </p>
        </div>

        {scenario === "ent-as-biz" && (
          <div className="rounded-xl border border-[var(--blue)] bg-[rgba(88,166,255,0.06)] p-3 text-sm">
            <div className="font-semibold text-[var(--blue)] mb-2 text-xs uppercase tracking-wide">ℹ GHEC + Copilot Business — you only pay for Business seats</div>
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="rounded-lg border border-[var(--green)] bg-[rgba(63,185,80,0.06)] p-2">
                <div className="tiny uppercase text-[var(--green)] mb-0.5">You save</div>
                <p className="text-xs text-[var(--text-muted)]">
                  $20 / seat — about{" "}
                  <strong className="text-white">${(20 * seats).toLocaleString()}/mo</strong>{" "}at {seats} seats.
                </p>
              </div>
              <div className="rounded-lg border border-[var(--yellow)] bg-[rgba(210,153,34,0.06)] p-2">
                <div className="tiny uppercase text-[var(--yellow)] mb-0.5">You give up</div>
                <p className="text-xs text-[var(--text-muted)]">
                  2,000 fewer credits/seat, no Spaces / Spark / KBs, no priority models.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[var(--line)] bg-[rgba(13,17,23,0.4)] p-2 text-xs text-[var(--text-muted)]">
          <strong className="text-white">How this is calculated:</strong> 50/50 input/output split, chosen model’s list price, pool exhaustion at entity level, flat $0.01/cr metered rate. Real numbers vary with model mix &amp; caching.
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[rgba(13,17,23,0.4)] p-3">
      <div className="tiny uppercase">{label}</div>
      <div className="font-mono text-xl font-bold mt-1 truncate" style={{ color }}>{value}</div>
      <div className="tiny mt-1 truncate" title={sub}>{sub}</div>
    </div>
  );
}
