# GitHub Copilot · Usage-Based Billing, Explained

An interactive 26-slide deck that walks you through GitHub Copilot's **Usage-Based Billing (UBB)** end to end — plans, AI credits, premium models, budgets, overage flow, migration timeline, and live calculators you can play with.

> Built for solution architects, customer success teams, and engineering managers who need to *explain* UBB to a real audience without flipping through 12 different docs pages.

**Live demo:** https://kardelruveyda.github.io/github-usage-based-billing/

---

## What's inside

- **26 slides** organized as analogy-first → technical detail (most sections have a `1/2` everyday-life analogy panel and a `2/2` deep-dive panel).
- **Interactive widgets** on most slides — sliders, model pickers, wallet presets, scenario builders.
- **Two flagship demos:**
  - **Slide 22 · Your topology** — *ScenarioBuilder*: pick seat count, profile mix, % heavy users, and a model, then watch per-user cost / pool consumption / overage update live.
  - **Slide 24 · Playground** — *CopilotPlayground*: pick a wallet preset (200 demo / 1,900 Business / 3,900 Enterprise / promo variants), choose a model from a tier-grouped picker, type a prompt, and see token → credit → wallet math in real time.
- **Slide 19 · Acme FinTech case study** — a full month of overage played out day by day, with the developer's IDE banner *and* the admin's email inbox both visible at every step.
- **Built-in pricing data** that mirrors the public GitHub docs (AI credit rates per model, plan pool sizes, promo windows).

## Sections

| #    | Section       | Theme                                                     |
| ---- | ------------- | --------------------------------------------------------- |
| 01–02 | Intro         | Why UBB exists, what changed                              |
| 03–04 | What's billed | Free vs metered Copilot features                          |
| 05–06 | AI Credits    | Tokens · USD · credits                                    |
| 07–08 | Plans         | Pool sizes by plan + promo period                         |
| 09–10 | Calculator    | Live token → credit math                                  |
| 11–12 | Estimator     | Monthly per-user credit estimator                         |
| 13–14 | Budgets       | The four budget controls                                  |
| 15   | Admin         | What the admin panel really looks like                    |
| 16–17 | Dashboard     | The AI usage dashboard, walked through                    |
| 18–19 | Overage       | Four phases + Acme FinTech month-long case study          |
| 20–21 | Migration     | 5-step rollout + minimum IDE versions                     |
| 22   | Your topology | ScenarioBuilder demo                                      |
| 23–24 | Playground    | Live Copilot playground                                   |
| 25–26 | FAQ           | 10 common questions                                       |

## Tech stack

- **Next.js 16** App Router with `output: 'export'` for fully static hosting
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (CSS-first config via `@theme inline`)
- **framer-motion** for slide transitions and micro-interactions
- **chart.js** for charts in the dashboard / calculator sections

Everything is client-side. No server, no API, no telemetry — drop it on any static host.

## Running locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000.

Navigation:

- `→` / `←` or `PageDown` / `PageUp` — next / previous slide
- Click any section in the bottom rail to jump
- Each slide has a stable URL hash (e.g. `#overage-more`) so you can deep-link

## Building a static export

```powershell
npm run build
```

Produces a static site in `out/`. To preview it locally with the GitHub Pages base path:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/github-usage-based-billing"
npm run build
npx serve out
```

## Deploying to GitHub Pages

[.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds the site on every push to `main` and publishes to GitHub Pages automatically. To enable it on a fresh fork:

1. Repository **Settings → Pages → Source: GitHub Actions**.
2. Push to `main` — the workflow does the rest.

The workflow sets `NEXT_PUBLIC_BASE_PATH=/github-usage-based-billing` so assets resolve under the project-scoped Pages URL.

## Author

**Kardel Rüveyda Çetin** — Digital Cloud Solution Architect

If you want to use this deck in your own customer conversations: fork it, swap the example numbers in [src/lib/models.ts](src/lib/models.ts) and [src/lib/sections.ts](src/lib/sections.ts), and you're set.

## Disclaimer

The pricing, pool sizes, and behavior described here reflect publicly documented Copilot Usage-Based Billing as of mid-2026. Always cross-check with the [official docs](https://docs.github.com/en/copilot/concepts/billing/billing-for-individual-usage) for the latest numbers before quoting them to a customer.
