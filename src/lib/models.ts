// Shared data layer.
// Source: GitHub Copilot UBB docs (June 2026).

export type Plan = {
  id: string;
  name: string;
  /** USD per user / month. */
  pricePerUserMonth: number;
  /** Included AI credits per user / month at the standard rate. */
  includedAiCredits: number;
  /** Promotional AI credit amount (June 1 – September 1, 2026, existing customers). */
  promotionalAiCredits: number;
  highlights: string[];
  audience: string;
};

export const PLANS: Plan[] = [
  {
    id: "business",
    name: "Copilot Business",
    pricePerUserMonth: 19,
    includedAiCredits: 1_900,
    promotionalAiCredits: 3_000,
    audience: "Organizations on GitHub Free / Team / Enterprise Cloud",
    highlights: [
      "Broad model catalog",
      "Org-level admin controls",
      "AI credits pooled across the org",
      "Audit logs",
    ],
  },
  {
    id: "enterprise",
    name: "Copilot Enterprise",
    pricePerUserMonth: 39,
    includedAiCredits: 3_900,
    promotionalAiCredits: 7_000,
    audience: "GitHub Enterprise Cloud only",
    highlights: [
      "Priority access to new models & features",
      "Knowledge bases · Spark",
      "AI credits pooled across the enterprise",
      "Cost-center & enterprise budgets",
    ],
  },
];

/** 1 AI credit = $0.01 USD (fixed, from the UBB rate sheet). */
export const USD_PER_CREDIT = 0.01;
export const USD_TO_CREDITS = 100;

/**
 * Per-model token rates.
 *
 * GitHub does not publish per-model AI-credit conversion publicly — only that
 * "each token is priced based on the model used" and the total is converted at
 * 1 credit = $0.01 USD. The figures below are ILLUSTRATIVE public list prices
 * in USD per 1M tokens to show customers how the same prompt can cost wildly
 * different amounts across models.
 */
export type Model = {
  id: string;
  name: string;
  vendor: string;
  tier: "Lightweight" | "Standard" | "Premium";
  inputPer1M: number;
  outputPer1M: number;
  cachedPer1M: number;
};

export const MODELS: Model[] = [
  { id: "gpt-4o-mini",     name: "GPT-4o mini",      vendor: "OpenAI",    tier: "Lightweight", inputPer1M: 0.15, outputPer1M: 0.60, cachedPer1M: 0.075 },
  { id: "gpt-4.1",         name: "GPT-4.1",          vendor: "OpenAI",    tier: "Standard",    inputPer1M: 2.00, outputPer1M: 8.00, cachedPer1M: 0.50  },
  { id: "gpt-5",           name: "GPT-5",            vendor: "OpenAI",    tier: "Premium",     inputPer1M: 5.00, outputPer1M: 20.0, cachedPer1M: 1.00  },
  { id: "claude-haiku",    name: "Claude Haiku 3.5", vendor: "Anthropic", tier: "Lightweight", inputPer1M: 0.80, outputPer1M: 4.00, cachedPer1M: 0.08  },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4",  vendor: "Anthropic", tier: "Standard",    inputPer1M: 3.00, outputPer1M: 15.0, cachedPer1M: 0.30  },
  { id: "claude-opus-4",   name: "Claude Opus 4",    vendor: "Anthropic", tier: "Premium",     inputPer1M: 15.0, outputPer1M: 75.0, cachedPer1M: 1.50  },
  { id: "gemini-2.5-pro",  name: "Gemini 2.5 Pro",   vendor: "Google",    tier: "Standard",    inputPer1M: 1.25, outputPer1M: 10.0, cachedPer1M: 0.125 },
];

export const tierColor: Record<Model["tier"], string> = {
  Lightweight: "#3fb950",
  Standard:    "#58a6ff",
  Premium:     "#8957e5",
};

/** Features that DO consume AI credits, per GitHub Copilot UBB docs. */
export const BILLED_FEATURES = [
  { name: "Copilot Chat",              desc: "Every chat message hits an AI model and draws credits." },
  { name: "Copilot CLI",               desc: "Each invocation that calls an AI model is metered." },
  { name: "Copilot cloud agent",       desc: "Autonomous, multi-step sessions — typically the largest single consumer." },
  { name: "Copilot Spaces",            desc: "Workspaces backed by AI models for grounded reasoning." },
  { name: "Spark",                     desc: "Idea → working app generation; large token footprint." },
  { name: "Third-party coding agents", desc: "External agents that call Copilot models through GitHub." },
];

/** Features that do NOT consume AI credits and remain unlimited on paid plans. */
export const UNBILLED_FEATURES = [
  { name: "Code completions",      desc: "Inline ghost-text suggestions in the IDE." },
  { name: "Next edit suggestions", desc: "Smart edit predictions while you type." },
];

/** Minimum IDE / client versions for accurate UBB pricing display. */
export const MIN_VERSIONS: { name: string; version: string }[] = [
  { name: "VS Code",                      version: "1.120"    },
  { name: "Visual Studio 2022",           version: "17.14.33" },
  { name: "Visual Studio 2025",           version: "18.6.0"   },
  { name: "SQL Server Management Studio", version: "22.6"     },
  { name: "JetBrains plugin",             version: "1.9.1"    },
  { name: "Eclipse plugin",               version: "0.18.0"   },
  { name: "Xcode extension",              version: "0.50.0"   },
  { name: "Copilot CLI",                  version: "1.0.48"   },
];

/** Promotional period: 3 months of higher included AI credits for existing customers. */
export const PROMO = {
  startISO: "2026-06-01",
  endISO:   "2026-09-01",
  label:    "June 1 – September 1, 2026",
};
