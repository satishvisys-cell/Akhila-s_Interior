"use client";

import { useRef, useState } from "react";
import NextLink from "next/link";
import { EDITORIAL } from "@/lib/editorial";
import { EditorialCard } from "@/components/sections/editorial-card";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { cn } from "@/lib/cn";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

export type ProcessStage = {
  id: string;
  n: string;
  title: string;
  duration: string;
  body: string;
  outcomes: readonly string[];
  image: string;
};

export const PROCESS_STAGES: readonly ProcessStage[] = [
  {
    id: "consultation",
    n: "01",
    title: "Consultation",
    duration: "1–2 weeks",
    body: "Site, brief, constraints, and aspirations — we listen before we specify a single finish.",
    outcomes: ["Project brief", "Budget bands", "Room priorities"],
    image: EDITORIAL.intro[0],
  },
  {
    id: "concept",
    n: "02",
    title: "Concept",
    duration: "2–3 weeks",
    body: "Spatial diagrams and mood that resolve light, privacy, flow, and how each room should feel.",
    outcomes: ["Concept boards", "Space plan", "Material direction"],
    image: EDITORIAL.rooms.living,
  },
  {
    id: "design",
    n: "03",
    title: "Design",
    duration: "3–5 weeks",
    body: "Ceilings, electrics, colour, paper, glass, and shade refined with you at every milestone.",
    outcomes: ["Detailed drawings", "Finish schedules", "Sample approvals"],
    image: EDITORIAL.rooms.light,
  },
  {
    id: "visualization",
    n: "04",
    title: "Visualization",
    duration: "1–2 weeks",
    body: "Cinematic imagery and spatial sequences that make intent tangible before a single trade starts.",
    outcomes: ["Room visuals", "Detail close-ups", "Lighting studies"],
    image: EDITORIAL.collection[0],
  },
  {
    id: "approval",
    n: "05",
    title: "Approval",
    duration: "1 week",
    body: "Budgets, vendors, and documentation locked — so fit-out begins with clarity, not guesswork.",
    outcomes: ["Signed scope", "Vendor list", "Programme"],
    image: EDITORIAL.services[1],
  },
  {
    id: "fit-out",
    n: "06",
    title: "Fit-Out",
    duration: "On site",
    body: "On-site interior craft with weekly transparency — progress, decisions, and snags logged.",
    outcomes: ["Weekly reports", "Site walks", "Quality checks"],
    image: EDITORIAL.rooms.kitchen,
  },
  {
    id: "monitoring",
    n: "07",
    title: "Monitoring",
    duration: "Throughout",
    body: "Authorized live cameras and stage updates for stakeholders who want clarity without the site visit.",
    outcomes: ["Live feeds", "Stage markers", "Secure access"],
    image: EDITORIAL.compare.reimagine,
  },
  {
    id: "handover",
    n: "08",
    title: "Handover",
    duration: "Final week",
    body: "Commissioning, manuals, and a calm walkthrough of your completed home — ready to live in.",
    outcomes: ["Snag close-out", "Care manuals", "Keys & walkthrough"],
    image: EDITORIAL.rooms.sleep,
  },
] as const;

export function ProcessJourney() {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const stage = PROCESS_STAGES[active];
  const progress = ((active + 1) / PROCESS_STAGES.length) * 100;

  useGSAP(
    () => {
      const media = mediaRef.current;
      const copy = copyRef.current;
      if (!media || !copy) return;

      if (prefersReducedMotion()) {
        gsap.set([media, copy], { clearProps: "all" });
        return;
      }

      const img = media.querySelector("img");
      const bits = copy.querySelectorAll("[data-process-bit]");

      gsap.fromTo(
        img,
        { scale: 1.08, autoAlpha: 0.55, filter: "blur(8px)" },
        {
          scale: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.85,
          ease: gsapMotion.ease.standard,
          overwrite: "auto",
        },
      );

      gsap.fromTo(
        bits,
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: gsapMotion.ease.standard,
          overwrite: "auto",
        },
      );
    },
    { scope: rootRef, dependencies: [active] },
  );

  return (
    <EditorialCard className="font-editorial" motion>
      <div ref={rootRef} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Sticky cinematic panel */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
            <div
              ref={mediaRef}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f3f1ee] md:aspect-[5/6]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={stage.id}
                src={stage.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Stage {stage.n}
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  {stage.title}
                </p>
                <p className="mt-2 text-sm text-white/80">{stage.duration}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-widest text-text-muted">
                <span>Journey</span>
                <span>
                  {stage.n} / {String(PROCESS_STAGES.length).padStart(2, "0")}
                </span>
              </div>
              <div className="h-px overflow-hidden bg-border">
                <div
                  className="h-full bg-terracotta transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive stages */}
        <div className="lg:col-span-7">
          <div className="relative mb-8">
            <div className="scroll-fade-x flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PROCESS_STAGES.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border px-4 text-xs font-semibold tracking-wide transition-all duration-300",
                    i === active
                      ? "border-ink-button bg-ink-button text-white shadow-[0_8px_20px_rgba(17,17,17,0.12)]"
                      : "border-black/10 text-text-muted hover:border-ink-button/40 hover:text-ink-button",
                  )}
                  aria-pressed={i === active}
                >
                  {item.n}
                </button>
              ))}
            </div>
          </div>

          <div ref={copyRef}>
            <p
              data-process-bit
              className="text-sm font-semibold uppercase tracking-[0.18em] text-terracotta"
            >
              {stage.duration}
            </p>
            <h2
              data-process-bit
              className="mt-3 text-3xl font-extrabold tracking-tight text-ink-button md:text-5xl"
            >
              {stage.title}
            </h2>
            <p
              data-process-bit
              className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg"
            >
              {stage.body}
            </p>

            <ul
              data-process-bit
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {stage.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="rounded-xl border border-black/10 bg-[#faf9f7] px-4 py-4 text-sm font-medium text-ink-button transition-all duration-300 hover:-translate-y-0.5 hover:border-ink-button/20 hover:shadow-[0_10px_24px_rgba(17,17,17,0.06)] motion-reduce:hover:translate-y-0"
                >
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          <ol className="mt-10 border-t border-border">
            {PROCESS_STAGES.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.id} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => {
                      if (window.matchMedia("(min-width: 1024px)").matches) {
                        setActive(i);
                      }
                    }}
                    className={cn(
                      "group grid w-full min-h-14 grid-cols-[3rem_1fr_auto_auto] items-center gap-3 py-5 text-left transition-colors sm:gap-4",
                      on ? "text-ink-button" : "text-text-muted hover:text-ink-button",
                    )}
                    aria-current={on ? "step" : undefined}
                  >
                    <span
                      className={cn(
                        "text-sm tabular-nums",
                        on ? "text-terracotta" : "",
                      )}
                    >
                      {item.n}
                    </span>
                    <span
                      className={cn(
                        "text-lg font-extrabold tracking-tight md:text-xl",
                        on ? "text-ink-button" : "",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "hidden text-sm sm:inline",
                        on ? "text-text-secondary" : "text-text-muted",
                      )}
                    >
                      {item.duration}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "text-sm transition-transform duration-300",
                        on ? "translate-x-0 text-terracotta" : "translate-x-0 opacity-40 group-hover:translate-x-0.5 group-hover:opacity-100",
                      )}
                    >
                      →
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
                      on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0">
                      <p className="pb-5 text-sm leading-relaxed text-text-secondary">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-wrap gap-3">
            <NextLink
              href="/live-sites"
              className="btn-press inline-flex h-11 items-center rounded-md border border-black/15 px-5 text-sm font-semibold text-ink-button hover:bg-black/5"
            >
              Live Sites
            </NextLink>
            <MagneticButton
              href="/contact"
              className="btn-press inline-flex h-11 items-center rounded-md bg-ink-button px-5 text-sm font-semibold text-white hover:bg-black"
            >
              Start a Project
            </MagneticButton>
          </div>
        </div>
      </div>
    </EditorialCard>
  );
}
