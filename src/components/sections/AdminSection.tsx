import { SectionShell } from "../SectionShell";
import { BudgetSlider } from "../interactive/BudgetSlider";
import { FakeGitHubSettings } from "../interactive/FakeGitHubSettings";

const SETTING_PATHS: Array<{ name: string; path: string }> = [
  { name: "Enterprise spending limit",              path: "Enterprise → Settings → Billing & licensing → Spending limits" },
  { name: "“Stop usage when limit reached” toggle", path: "Enterprise → Settings → Copilot → Policies" },
  { name: "Universal user-level budget",            path: "Enterprise → Settings → Copilot → Budgets → Universal user limit" },
  { name: "Per-user budget override",               path: "Same screen → pick a user → Override budget" },
  { name: "Cost-center budget",                     path: "Enterprise → Settings → Cost centers → pick one → Budget" },
  { name: "Usage dashboard",                        path: "Enterprise → Settings → Billing → Usage this month → Copilot" },
];

export function AdminSection() {
  return (
    <SectionShell
      id="admin"
      eyebrow="08 · The control panel"
      title={<>Set the <span className="gradient-text">policy</span> &amp; enterprise limit</>}
      compact
    >
      <div className="grid lg:grid-cols-2 gap-4">
        <FakeGitHubSettings />
        <BudgetSlider />
      </div>

      <div className="mt-4 p-4 rounded-2xl border border-[var(--line)] bg-[rgba(13,17,23,0.5)]">
        <p className="text-sm mb-3">
          <strong className="text-white">Where do I actually configure each control?</strong>{" "}
          <span className="text-[var(--text-muted)]">
            Each &ldquo;door&rdquo; lives on a different page. Only enterprise owners and billing managers can reach them.
          </span>
        </p>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
          {SETTING_PATHS.map((row) => (
            <div key={row.name} className="flex gap-2">
              <span className="text-white font-semibold whitespace-nowrap">{row.name}</span>
              <span className="text-[var(--text-muted)] font-mono truncate" title={row.path}>
                {row.path}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
