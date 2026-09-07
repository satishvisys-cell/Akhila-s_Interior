import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";

export const metadata: Metadata = {
  title: "How We Build",
  description:
    "An eight-stage journey from consultation to handover — transparent, paced, and intentional.",
};

const STAGES = [
  {
    n: "01",
    title: "Consultation",
    body: "Site, brief, constraints, and aspirations — we listen before we draw.",
  },
  {
    n: "02",
    title: "Concept",
    body: "Spatial diagrams and massing that resolve light, privacy, and flow.",
  },
  {
    n: "03",
    title: "Design",
    body: "Materials, sections, and details refined with the client at every milestone.",
  },
  {
    n: "04",
    title: "Visualization",
    body: "Cinematic imagery and spatial sequences that make intent tangible.",
  },
  {
    n: "05",
    title: "Approval",
    body: "Budgets, vendors, and documentation locked before ground breaks.",
  },
  {
    n: "06",
    title: "Construction",
    body: "Site craft with weekly transparency — progress and decisions logged.",
  },
  {
    n: "07",
    title: "Monitoring",
    body: "Authorized live cameras and stage updates for stakeholder clarity.",
  },
  {
    n: "08",
    title: "Handover",
    body: "Commissioning, manuals, and a calm walkthrough of your completed home.",
  },
] as const;

export default function ProcessPage() {
  return (
    <div className="bg-bg pt-[calc(var(--header-h)+2rem)]">
      <div className="mx-auto max-w-7xl px-8 md:px-12">
        <FadeUp className="mb-16 max-w-3xl md:mb-24">
          <span className="mb-4 block font-sans text-xs uppercase tracking-[0.3em] text-accent">
            Process
          </span>
          <h1 className="mb-6 font-display text-5xl font-light tracking-tight text-graphite md:text-7xl">
            How We Build
          </h1>
          <p className="text-lg font-light leading-relaxed text-text/70">
            Architecture is a journey. Ours is paced, documented, and shared —
            so you always know where the project stands.
          </p>
        </FadeUp>

        <ol className="relative border-l border-border pl-8 md:pl-0">
          {STAGES.map((stage, i) => (
            <li key={stage.n} className="relative md:grid md:grid-cols-12 md:gap-8">
              <FadeUp
                delay={i * 40}
                className="grid gap-4 border-b border-border py-10 md:col-span-12 md:grid-cols-12 md:gap-8 md:py-14"
              >
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-accent md:col-span-2">
                  {stage.n}
                </p>
                <h2 className="font-display text-2xl text-graphite md:col-span-3 md:text-3xl">
                  {stage.title}
                </h2>
                <p className="font-sans font-light leading-relaxed text-text/70 md:col-span-7">
                  {stage.body}
                </p>
              </FadeUp>
            </li>
          ))}
        </ol>

        <FadeUp className="flex flex-col gap-6 py-20 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl font-light text-text/70">
            Prefer to watch a live build? Visit Live Sites for secured
            construction cameras and stage updates.
          </p>
          <div className="flex flex-wrap gap-3">
            <NextLink
              href="/live-sites"
              className="inline-flex h-11 items-center rounded border border-graphite/80 px-6 text-xs uppercase tracking-widest transition-colors hover:bg-graphite hover:text-text-inverse"
            >
              Live Sites
            </NextLink>
            <NextLink
              href="/contact"
              className="inline-flex h-11 items-center rounded bg-accent px-6 text-xs uppercase tracking-widest text-text-inverse hover:bg-accent-hover"
            >
              Start a Project
            </NextLink>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}
