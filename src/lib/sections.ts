// Section metadata used by the slide deck.
// Order here = order of slides after the title slide.
// `parts` is the number of sub-slides this section expands to (1 = single, 2 = analogy + details).

export type Section = {
  id: string;
  label: string;        // short nav label
  title: string;        // section heading
  eyebrow: string;      // small uppercase tag
  parts?: 1 | 2;        // default 1
};

export const SECTIONS: Section[] = [
  { id: "intro",       label: "Intro",         eyebrow: "01 · Start here",          title: "What is Usage-Based Billing?",                       parts: 2 },
  { id: "whats-billed",label: "What's billed", eyebrow: "02 · The meter",           title: "What does (and doesn't) consume AI credits",         parts: 2 },
  { id: "ai-credits",  label: "AI Credits",    eyebrow: "03 · The currency",        title: "Tokens · USD · AI Credits",                          parts: 2 },
  { id: "plans",       label: "Plans",         eyebrow: "04 · What you get",        title: "Included AI credits by plan",                        parts: 2 },
  { id: "calculator",  label: "Calculator",    eyebrow: "05 · Try it",              title: "Live token → credit calculator",                     parts: 2 },
  { id: "estimator",   label: "Estimator",     eyebrow: "06 · Day-to-day",          title: "Monthly AI credit estimator",                        parts: 2 },
  { id: "prompt-discipline", label: "Prompt",  eyebrow: "06.5 · Prompt as a cost lever", title: "Same credit, 2× the work",                       parts: 1 },
  { id: "budgets",     label: "Budgets",       eyebrow: "07 · The four controls",   title: "How budgets cap consumption",                        parts: 2 },
  { id: "admin",       label: "Admin",         eyebrow: "08 · The control panel",   title: "Set the policy & enterprise limit",                  parts: 1 },
  { id: "dashboard",   label: "Dashboard",     eyebrow: "09 · See it",              title: "AI usage dashboard (mock)",                          parts: 2 },
  { id: "overage",     label: "Overage",       eyebrow: "10 · Pool exhausted",      title: "What happens when credits run out",                  parts: 2 },
  { id: "migration",   label: "Migration",     eyebrow: "11 · Timeline",            title: "Promotional period & rollout plan",                  parts: 2 },
  { id: "culture",     label: "Culture",       eyebrow: "11.5 · Repeatable efficiency", title: "Custom agents, skills & session hygiene",        parts: 1 },
  { id: "scenario",    label: "Your topology", eyebrow: "12 · Demo · Your topology", title: "What will this cost my org?",                        parts: 1 },
  { id: "playground",  label: "Playground",    eyebrow: "13 · Demo · Try a real prompt", title: "Live Copilot playground",                       parts: 2 },
  { id: "faq",         label: "FAQ",           eyebrow: "14 · Common questions",    title: "Frequently asked questions",                         parts: 2 },
];
