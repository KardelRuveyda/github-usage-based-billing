"use client";

import { useState } from "react";

/**
 * OverageStory — a real-world walk-through of one month at "Acme FinTech":
 * 200 Business seats · Universal ULB $30/user · Enterprise limit $500 · toggle ON.
 * Click each event to see what the developer sees in their IDE *and* what the
 * admin gets in their inbox at that moment.
 */
type EventState = "ok" | "warn" | "metered" | "user-blocked" | "org-blocked" | "reset";

type StoryEvent = {
  date: string;
  time: string;
  state: EventState;
  headline: string;
  sub: string;
  ide: { tone: "info" | "warn" | "danger" | "ok"; title: string; body: string; demo: { user: string; copilot: string; tab?: string } };
  email: { subject: string; body: string; cta?: string };
};

const STORY: StoryEvent[] = [
  {
    date: "Jun 1",
    time: "00:00",
    state: "ok",
    headline: "Cycle starts — pool full",
    sub: "200 seats × 1,900 cr = 380,000 cr pool",
    ide: {
      tone: "ok",
      title: "Wallet: 1,900 / 1,900 credits",
      body: "Fresh month. Every prompt draws from your seat allocation.",
      demo: { user: "Refactor this controller into smaller services", copilot: "Sure — I'll break it into 3 services…" },
    },
    email: { subject: "—", body: "Quiet inbox. Nothing to do." },
  },
  {
    date: "Jun 18",
    time: "09:42",
    state: "warn",
    headline: "Pool hits 75% (285K cr used)",
    sub: "Heavy agent week. Admin gets first heads-up.",
    ide: {
      tone: "warn",
      title: "Status pill turns yellow",
      body: "Nothing changes for the developer — Chat, agent and CLI keep working.",
      demo: { user: "Write tests for PaymentService", copilot: "Generating 8 test cases…" },
    },
    email: {
      subject: "Acme FinTech has used 75% of its AI credits",
      body: "Your organization has consumed 285,000 / 380,000 included credits for June. No action required, but expect metered (paid) usage to begin soon.",
      cta: "Review usage dashboard →",
    },
  },
  {
    date: "Jun 22",
    time: "14:15",
    state: "metered",
    headline: "Pool drained → metered phase",
    sub: "Every credit now costs $0.01. Enterprise limit ($500) starts ticking.",
    ide: {
      tone: "warn",
      title: "Now using paid AI credits — $0.01 per credit",
      body: "Banner appears in IDE. Chat works exactly the same; usage just hits the metered bucket now.",
      demo: { user: "Find the N+1 query in OrderRepo", copilot: "Found one — line 84, eager-load Customer…" },
    },
    email: {
      subject: "Metered AI credit usage has started",
      body: "Acme's included pool is exhausted. Billable Copilot features are now drawing against your $500 enterprise spending limit.",
      cta: "Open Billing settings →",
    },
  },
  {
    date: "Jun 25",
    time: "11:03",
    state: "user-blocked",
    headline: "Aylin's $30 ULB exhausted",
    sub: "Heavy Opus 4 agent runs. Only Aylin is blocked — team unaffected.",
    ide: {
      tone: "danger",
      title: "You've reached your monthly Copilot budget",
      body: "Chat, agent and CLI are paused until Jul 1 or until your admin raises your limit. Code completions still work.",
      demo: {
        user: "@workspace explain CreditEngine",
        copilot: "✗ Blocked — your user-level budget is reached.",
        tab: "// Tab still works → const engine = new CreditEngine(",
      },
    },
    email: {
      subject: "Aylin K. reached her user-level budget",
      body: "Aylin K. ($30 ULB) has hit her monthly Copilot AI credit limit. She is blocked from Chat / agent / CLI until next cycle or until you raise her limit.",
      cta: "Raise Aylin's budget →",
    },
  },
  {
    date: "Jun 28",
    time: "16:30",
    state: "org-blocked",
    headline: "Enterprise $500 limit hit · toggle ON",
    sub: "Org-wide hard stop. All 200 devs blocked — completions still work.",
    ide: {
      tone: "danger",
      title: "Enterprise spending limit reached",
      body: "Billable Copilot features are paused org-wide until Jul 1 or until an admin raises the limit. Inline completions and next-edit suggestions keep working.",
      demo: {
        user: "Add input validation to /api/transfer",
        copilot: "✗ Blocked — enterprise spending limit reached.",
        tab: "// Tab still works → if (!isValidIBAN(input.iban)) return badRequest(",
      },
    },
    email: {
      subject: "Enterprise spending limit reached — billable features paused",
      body: "Acme FinTech has reached its $500 spending limit. Because 'Stop usage when budget limit is reached' is ON, all billable Copilot features are paused for every user.",
      cta: "Raise spending limit →",
    },
  },
  {
    date: "Jul 1",
    time: "00:00",
    state: "reset",
    headline: "New billing cycle — everyone back online",
    sub: "Pool refilled, ULBs reset. Lesson: tune Universal ULB lower next month.",
    ide: {
      tone: "ok",
      title: "Wallet: 1,900 / 1,900 credits",
      body: "Banners gone. Chat / agent / CLI fully restored.",
      demo: { user: "Continue the refactor we left on Jun 28", copilot: "Picking up where we stopped…" },
    },
    email: { subject: "New billing cycle started for Acme FinTech", body: "Pool refilled to 380,000 cr. Metered counter reset to $0 / $500." },
  },
];

const TONE = {
  ok:     { bg: "rgba(63,185,80,0.08)",  border: "rgba(63,185,80,0.4)",  color: "var(--green)"  },
  info:   { bg: "rgba(56,139,253,0.08)", border: "rgba(56,139,253,0.4)", color: "var(--blue)"   },
  warn:   { bg: "rgba(210,153,34,0.10)", border: "rgba(210,153,34,0.4)", color: "var(--yellow)" },
  danger: { bg: "rgba(248,81,73,0.10)",  border: "rgba(248,81,73,0.4)",  color: "var(--red)"    },
} as const;

const DOT = {
  ok:            "var(--green)",
  warn:          "var(--yellow)",
  metered:       "#f59e0b",
  "user-blocked": "var(--red)",
  "org-blocked":  "var(--red)",
  reset:          "var(--green)",
} as const;

export function OverageStory() {
  const [i, setI] = useState(0);
  const e = STORY[i];

  return (
    <div className="grid lg:grid-cols-[1.05fr_1.4fr] gap-5">
      {/* LEFT — story timeline */}
      <div className="glass p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="tier-pill premium">Acme FinTech · case study</span>
          <span className="tiny ml-auto">{i + 1} / {STORY.length}</span>
        </div>

        <div className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
          <span className="font-mono">200 Business seats</span> · Universal <span className="font-mono">ULB $30/user</span> · Enterprise limit <span className="font-mono">$500</span> · &quot;Stop usage when budget reached&quot; <span className="text-[var(--green)] font-semibold">ON</span>
        </div>

        <ol className="space-y-2">
          {STORY.map((ev, idx) => {
            const active = idx === i;
            return (
              <li key={ev.date + ev.time}>
                <button
                  onClick={() => setI(idx)}
                  className={`w-full text-left flex gap-3 items-start px-3 py-2 rounded-lg border transition-colors ${
                    active
                      ? "border-[rgba(137,87,229,0.6)] bg-[rgba(137,87,229,0.12)]"
                      : "border-transparent hover:bg-white/5"
                  }`}
                >
                  <span
                    className="mt-1 w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: DOT[ev.state], boxShadow: active ? `0 0 0 3px ${DOT[ev.state]}33` : "none" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-[var(--text-muted)]">{ev.date} · {ev.time}</span>
                    </div>
                    <div className={`text-sm font-semibold ${active ? "text-white" : "text-[var(--text)]"}`}>{ev.headline}</div>
                    <div className="tiny text-[var(--text-muted)]">{ev.sub}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* RIGHT — what each persona sees */}
      <div className="flex flex-col gap-4">
        {/* Developer IDE */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-0)] overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--line)] tiny font-mono flex items-center justify-between">
            <span>👩‍💻 Aylin · VS Code · GitHub Copilot Chat</span>
            <span className="text-[var(--text-muted)]">Acme FinTech</span>
          </div>
          <div className="p-4 flex flex-col gap-3 min-h-[200px]">
            <Banner tone={e.ide.tone} title={e.ide.title} body={e.ide.body} />
            <div className="text-sm font-mono flex flex-col gap-1.5">
              <div><span className="text-[var(--green)]">user&gt;</span> <span className="text-[var(--text-muted)]">{e.ide.demo.user}</span></div>
              <div className={e.ide.tone === "danger" ? "text-[var(--red)]" : "text-[var(--text-muted)]"}>
                <span className={e.ide.tone === "danger" ? "text-[var(--red)]" : "text-[var(--blue)]"}>copilot&gt;</span> {e.ide.demo.copilot}
              </div>
              {e.ide.demo.tab && (
                <div className="text-[var(--green)] text-xs italic mt-1">{e.ide.demo.tab}</div>
              )}
            </div>
          </div>
        </div>

        {/* Admin email */}
        <div className="rounded-xl border border-[var(--line)] bg-[var(--bg-0)] overflow-hidden">
          <div className="px-4 py-2 border-b border-[var(--line)] tiny font-mono flex items-center justify-between">
            <span>📬 Priya · Admin inbox</span>
            <span className="text-[var(--text-muted)]">from billing@github.com</span>
          </div>
          <div className="p-4 flex flex-col gap-1.5 min-h-[110px]">
            {e.email.subject === "—" ? (
              <div className="text-sm text-[var(--text-muted)] italic">{e.email.body}</div>
            ) : (
              <>
                <div className="text-sm font-semibold">{e.email.subject}</div>
                <div className="text-xs text-[var(--text-muted)] leading-relaxed">{e.email.body}</div>
                {e.email.cta && (
                  <a className="text-xs text-[var(--blue)] mt-1 hover:underline cursor-pointer">{e.email.cta}</a>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setI((v) => Math.max(0, v - 1))}
            className="px-4 py-2 rounded-lg text-sm border border-[var(--line)] text-[var(--text-muted)] hover:text-white"
          >
            ← prev day
          </button>
          <button
            onClick={() => setI((v) => Math.min(STORY.length - 1, v + 1))}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "var(--accent-gradient)" }}
          >
            next day →
          </button>
        </div>
      </div>
    </div>
  );
}

function Banner({ tone, title, body }: { tone: keyof typeof TONE; title: string; body: string }) {
  const p = TONE[tone];
  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm"
      style={{ background: p.bg, borderColor: p.border, color: p.color }}
    >
      <div className="font-semibold">{title}</div>
      <div className="text-[var(--text-muted)] text-xs mt-1 leading-relaxed">{body}</div>
    </div>
  );
}
