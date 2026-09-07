"use client";

import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";

/**
 * "Our Core Disciplines" accordion-style list — ported from the approved
 * Stitch v2 "Cinematic Sequence" homepage variant. Oversized serif rows on
 * graphite, each linking to its anchor on /services. Hover state is a
 * simple CSS transform (slide-in + icon rotate) — deliberately not GSAP,
 * since a two-property hover transition doesn't need a timeline/ScrollTrigger.
 */
const DISCIPLINES = [
  { title: "Architecture", href: "/services#architecture" },
  { title: "Interior Design", href: "/services#interior-design" },
  { title: "Construction", href: "/services#construction" },
] as const;

export function ExpertiseList() {
  return (
    <section className="relative z-20 bg-graphite py-32 text-text-inverse">
      <div className="mx-auto max-w-7xl px-8">
        <FadeUp>
          <p className="mb-12 font-sans text-xs uppercase tracking-widest text-text-inverse/50 md:mb-24">
            Our Core Disciplines
          </p>
        </FadeUp>

        <ul className="flex w-full flex-col border-t border-white/10">
          {DISCIPLINES.map((d, i) => (
            <FadeUp key={d.title} delay={i * 70} className="group border-b border-white/10">
              <NextLink
                href={d.href}
                className="flex items-center justify-between py-12 transition-all duration-500 hover:pl-8 focus-visible:pl-8"
              >
                <h3 className="font-display text-5xl font-light transition-all group-hover:italic md:text-7xl">
                  {d.title}
                </h3>
                <span
                  className="text-4xl text-text-inverse/30 transition-all duration-300 group-hover:-rotate-45 group-hover:text-text-inverse"
                  aria-hidden
                >
                  →
                </span>
              </NextLink>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}
