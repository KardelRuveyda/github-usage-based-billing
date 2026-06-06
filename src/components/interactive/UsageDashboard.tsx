"use client";

import { useMemo } from "react";
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { MODELS, tierColor } from "@/lib/models";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, ArcElement);

/**
 * UsageDashboard — fake "Copilot usage" admin dashboard.
 * Two charts: spend by user, spend by model. All data is illustrative.
 */
export function UsageDashboard() {
  // Placeholder data — replace with realistic sample numbers from GitHub docs/screenshots later.
  const userData = useMemo(
    () => [
      { user: "alice",    credits: 1820 },
      { user: "bob",      credits: 1410 },
      { user: "carol",    credits: 980  },
      { user: "danny",    credits: 760  },
      { user: "ethan",    credits: 540  },
      { user: "frida",    credits: 410  },
      { user: "george",   credits: 220  },
    ],
    []
  );

  const modelSpend = useMemo(
    () =>
      MODELS.map((m, i) => ({
        name: m.name,
        tier: m.tier,
        credits: [1200, 800, 400, 600, 950, 250, 180][i] ?? 100,
      })),
    []
  );

  const totalCredits = modelSpend.reduce((s, m) => s + m.credits, 0);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* KPI strip */}
      <div className="lg:col-span-3 grid sm:grid-cols-4 gap-4">
        <Kpi label="AI Credits used"        value={totalCredits.toLocaleString()} accent="var(--blue)"   />
        <Kpi label="Included this month"    value="10,000"                         accent="var(--green)"  />
        <Kpi label="Projected end-of-month" value="12,800"                         accent="var(--yellow)" />
        <Kpi label="Spending limit"         value="$500"                           accent="var(--purple)" />
      </div>

      {/* By user */}
      <div className="glass lg:col-span-2 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">AI Credits by user · last 30 days</h3>
          <span className="tier-pill standard">Top 7</span>
        </div>
        <div style={{ height: 280 }}>
          <Bar
            data={{
              labels: userData.map((u) => u.user),
              datasets: [
                {
                  label: "AI Credits",
                  data: userData.map((u) => u.credits),
                  backgroundColor: "#58a6ffcc",
                  borderColor: "#58a6ff",
                  borderWidth: 1.5,
                  borderRadius: 6,
                  maxBarThickness: 32,
                },
              ],
            }}
            options={chartOpts()}
          />
        </div>
      </div>

      {/* By model */}
      <div className="glass p-5">
        <h3 className="text-lg font-semibold mb-3">Share by model</h3>
        <div style={{ height: 280 }}>
          <Doughnut
            data={{
              labels: modelSpend.map((m) => m.name),
              datasets: [
                {
                  data: modelSpend.map((m) => m.credits),
                  backgroundColor: modelSpend.map((m) => tierColor[m.tier] + "cc"),
                  borderColor: "#0d1117",
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom", labels: { color: "#9da7b3", font: { size: 11 } } },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[rgba(22,27,34,0.6)] p-4">
      <div className="font-mono text-2xl font-bold" style={{ color: accent }}>
        {value}
      </div>
      <div className="tiny mt-1">{label}</div>
    </div>
  );
}

function chartOpts() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#161b22", borderColor: "#30363d", borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9da7b3" } },
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9da7b3" } },
    },
  } as const;
}
