"use client";

import { useState } from "react";

/**
 * FakeGitHubSettings — a recreated "Settings → Billing → Copilot" panel that
 * customers can toggle/click to feel what enabling UBB looks like.
 *
 * No data leaves the page. Everything is local state.
 */
export function FakeGitHubSettings() {
  const [paidUsage, setPaidUsage]       = useState(true);
  const [stopUsage, setStopUsage]       = useState(false);
  const [notifyAdmins, setNotifyAdmins] = useState(true);
  const [notifyUsers, setNotifyUsers]   = useState(true);

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg-1)] overflow-hidden shadow-2xl">
      {/* Fake GitHub chrome */}
      <div className="px-5 py-3 border-b border-[var(--line)] flex items-center gap-3 bg-[var(--bg-0)]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-4 tiny font-mono">
          github.com / <span className="text-white">your-org</span> / settings / billing / copilot
        </span>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 pt-5 text-sm text-[var(--text-muted)]">
        Organization settings &nbsp;›&nbsp; Billing and plans &nbsp;›&nbsp;
        <span className="text-white">Copilot</span>
      </div>

      <div className="px-5 pt-2 pb-4">
        <h3 className="text-xl font-bold mt-1">Copilot AI credit usage</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Control how your organization or enterprise pays for Copilot AI credits
          once the included monthly pool is exhausted.
        </p>

        <SettingRow
          title="Enable AI credit paid usage"
          description="Allow members to keep using billed Copilot features beyond the included pool, metered at $0.01 USD per AI credit on your GitHub invoice."
          checked={paidUsage}
          onChange={setPaidUsage}
        />

        <SettingRow
          title="Stop usage when budget limit is reached"
          description="Off by default. Required to make cost-center and enterprise budgets enforce a hard stop instead of just an alert."
          checked={stopUsage}
          onChange={setStopUsage}
        />

        <SettingRow
          title="Notify admins when 75% of the spending limit is reached"
          checked={notifyAdmins}
          onChange={setNotifyAdmins}
        />

        <SettingRow
          title="Notify users when their personal budget is nearly exhausted"
          checked={notifyUsers}
          onChange={setNotifyUsers}
        />

        <div className="mt-4 flex gap-3">
          <button
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white"
            style={{ background: "var(--green)" }}
          >
            Save changes
          </button>
          <button className="px-3 py-1.5 rounded-lg text-sm border border-[var(--line)] text-[var(--text-muted)]">
            Cancel
          </button>
          {paidUsage && (
            <span
              className="ml-auto px-3 py-1.5 rounded-full text-xs font-mono"
              style={{ background: "rgba(63,185,80,0.18)", color: "var(--green)", border: "1px solid rgba(63,185,80,0.4)" }}
            >
              ● Paid usage on
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`mt-3 flex items-start gap-3 border-t border-[var(--line)] pt-3 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-1 ${
          checked ? "bg-[var(--green)]" : "bg-[var(--bg-2)] border border-[var(--line)]"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
      <div className="flex-1">
        <div className="text-sm font-semibold">{title}</div>
        {description && <p className="text-xs text-[var(--text-muted)] mt-1">{description}</p>}
      </div>
    </div>
  );
}
