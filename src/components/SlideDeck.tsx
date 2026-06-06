"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { SECTIONS } from "@/lib/sections";
import {
  IntroSection,
  WhatsBilledSection,
  AiCreditsSection,
  PlansSection,
  CalculatorSection,
  EstimatorSection,
  BudgetsSection,
  AdminSection,
  DashboardSection,
  OverageSection,
  MigrationSection,
  ScenarioSection,
  PlaygroundSection,
  FaqSection,
} from "@/components/sections";
import { TitleSlide } from "@/components/TitleSlide";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";

type SectionComp = ComponentType<{ part?: "a" | "b" }>;

type Slide =
  | { kind: "title"; id: "title"; label: string; component: ComponentType }
  | {
      kind: "section";
      id: string;          // unique slide id (and URL hash)
      label: string;       // shown in jump menu + dot title
      component: SectionComp;
      part?: "a" | "b";    // undefined = section has only one panel
      sectionIndex: number; // 1-based across SECTIONS
    };

const SECTION_COMPONENTS: Record<string, SectionComp> = {
  intro: IntroSection,
  "whats-billed": WhatsBilledSection,
  "ai-credits": AiCreditsSection,
  plans: PlansSection,
  calculator: CalculatorSection,
  estimator: EstimatorSection,
  budgets: BudgetsSection,
  admin: AdminSection,
  dashboard: DashboardSection,
  overage: OverageSection,
  migration: MigrationSection,
  scenario: ScenarioSection,
  playground: PlaygroundSection,
  faq: FaqSection,
};

const SLIDES: Slide[] = [
  { kind: "title", id: "title", label: "Start", component: TitleSlide },
  ...SECTIONS.flatMap((s, i): Slide[] => {
    const Comp = SECTION_COMPONENTS[s.id];
    const sectionIndex = i + 1;
    if (s.parts === 2) {
      return [
        { kind: "section", id: s.id,            label: `${s.label} · 1/2`, component: Comp, part: "a", sectionIndex },
        { kind: "section", id: `${s.id}-more`,  label: `${s.label} · 2/2`, component: Comp, part: "b", sectionIndex },
      ];
    }
    return [{ kind: "section", id: s.id, label: s.label, component: Comp, sectionIndex }];
  }),
];

const slideById = (id: string) => SLIDES.findIndex((s) => s.id === id);

export function SlideDeck() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Hash sync: read on mount + listen for back/forward.
  useEffect(() => {
    const fromHash = () => {
      const id = (typeof window !== "undefined" && window.location.hash.replace("#", "")) || "title";
      const i = slideById(id);
      if (i >= 0) setIndex(i);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Write hash + reset scroll when slide changes.
  useEffect(() => {
    const id = SLIDES[index].id;
    const desired = `#${id}`;
    if (typeof window !== "undefined" && window.location.hash !== desired) {
      history.replaceState(null, "", desired);
    }
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  const goTo = useCallback((nextIndex: number) => {
    setIndex((cur) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, nextIndex));
      setDirection(clamped > cur ? 1 : -1);
      return clamped;
    });
  }, []);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (inField) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SLIDES.length - 1);
      } else if (e.key.toLowerCase() === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo]);

  const current = SLIDES[index];
  const progress = ((index + 1) / SLIDES.length) * 100;

  const slideNumber = String(index).padStart(2, "0");
  const totalNumber = String(SLIDES.length - 1).padStart(2, "0");

  return (
    <MotionConfig reducedMotion="never">
      <div className="fixed inset-0 flex flex-col bg-[var(--bg-0)] text-[var(--text)] overflow-hidden">
      <BackgroundOrbs />

      {/* ─── Top bar ─────────────────────────────────────────────── */}
      <div className="relative z-30 flex items-center gap-4 px-5 md:px-8 py-3 border-b border-[var(--line)]/70 backdrop-blur-md bg-[rgba(13,17,23,0.6)]">
        <button
          onClick={() => goTo(0)}
          className="flex items-center gap-2 font-bold tracking-tight text-sm hover:opacity-80 transition"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-6 h-6 text-[var(--text)]"
            fill="currentColor"
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12 24 5.65 18.85.5 12 .5z" />
          </svg>
          <span className="text-[var(--text)]">Copilot UBB</span>
          <span className="tiny hidden md:inline" style={{ letterSpacing: "0.18em" }}>
            · SLIDES
          </span>
        </button>

        {/* Author byline */}
        <div className="hidden md:flex items-center text-[11px] leading-tight text-[var(--text-muted)] ml-2 pl-3 border-l border-[var(--line)]/60">
          <span className="font-semibold text-[var(--text)]">Kardel Rüveyda Çetin</span>
          <span className="mx-2 opacity-50">·</span>
          <span>Digital Cloud Solution Architect</span>
        </div>

        {/* slide counter */}
        <div className="ml-auto flex items-center gap-3 font-mono text-xs">
          <SlideNumber value={slideNumber} />
          <span className="text-[var(--text-muted)]">/</span>
          <span className="text-[var(--text-muted)]">{totalNumber}</span>
        </div>

        <SlideJump
          slides={SLIDES}
          activeIndex={index}
          onPick={goTo}
        />
      </div>

      {/* ─── Progress bar ────────────────────────────────────────── */}
      <div className="relative z-20 h-[3px] bg-[var(--bg-1)]">
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ background: "var(--accent-gradient)" }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 110, damping: 22 }}
        />
      </div>

      {/* ─── Slide stage ────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="relative flex-1 overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full"
          >
            {current.kind === "title" ? (
              <current.component />
            ) : (
              <current.component part={current.part} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Bottom controls ────────────────────────────────────── */}
      <div className="relative z-30 flex items-center gap-3 px-4 md:px-8 py-3 border-t border-[var(--line)]/70 backdrop-blur-md bg-[rgba(13,17,23,0.6)]">
        <NavButton dir="prev" disabled={index === 0} onClick={prev} />

        <div className="flex-1 flex items-center justify-center gap-1.5 overflow-x-auto px-2">
          {SLIDES.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.id}
                title={s.label}
                onClick={() => goTo(i)}
                className="group relative h-2 rounded-full transition-all"
                style={{
                  width: active ? 28 : 8,
                  background: active
                    ? "var(--accent-gradient)"
                    : "var(--bg-2)",
                  boxShadow: active ? "0 0 12px rgba(137,87,229,0.45)" : "none",
                }}
              >
                <span className="sr-only">{s.label}</span>
              </button>
            );
          })}
        </div>

        <NavButton dir="next" disabled={index === SLIDES.length - 1} onClick={next} />
      </div>
    </div>
    </MotionConfig>
  );
}

/* ─── Animated slide-number readout ─────────────────────────── */
function SlideNumber({ value }: { value: string }) {
  return (
    <span className="inline-block w-7 text-right">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block text-[var(--text)] font-bold"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── Prev / Next chevron button ────────────────────────────── */
function NavButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isNext = dir === "next";
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.06 } : {}}
      whileTap={!disabled ? { scale: 0.94 } : {}}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        borderColor: disabled ? "var(--line)" : "rgba(137,87,229,0.45)",
        background: disabled ? "transparent" : "rgba(137,87,229,0.12)",
        color: disabled ? "var(--text-muted)" : "var(--text)",
      }}
    >
      {!isNext && (
        <motion.span aria-hidden animate={{ x: [0, -2, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          ←
        </motion.span>
      )}
      <span>{isNext ? "Next" : "Prev"}</span>
      {isNext && (
        <motion.span aria-hidden animate={{ x: [0, 2, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          →
        </motion.span>
      )}
    </motion.button>
  );
}

/* ─── Pop-out section jumper ────────────────────────────────── */
function SlideJump({
  slides,
  activeIndex,
  onPick,
}: {
  slides: Slide[];
  activeIndex: number;
  onPick: (i: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-full text-xs font-semibold border border-[var(--line)] text-[var(--text-muted)] hover:text-white hover:bg-white/5"
      >
        Jump to ▾
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="absolute right-0 top-full mt-2 w-64 max-h-[60vh] overflow-y-auto rounded-xl border border-[var(--line)] bg-[rgba(13,17,23,0.96)] backdrop-blur-md shadow-2xl z-50 p-2"
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              {slides.map((s, i) => {
                const active = i === activeIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onPick(i);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      active
                        ? "bg-[rgba(137,87,229,0.18)] text-white"
                        : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="font-mono text-[10px] w-6 text-right text-[var(--text-muted)]">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
