"use client";

import NextLink from "next/link";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { FadeUp } from "@/components/motion/fade-up";
import { cn } from "@/lib/cn";

/**
 * Homepage "Selected Works" teaser — asymmetric editorial grid ported from
 * the approved Stitch v2 "Cinematic Sequence" variant. Distinct from the
 * full /projects archive (which uses an overlay-on-hover card style): here
 * metadata sits below each frame, and the three works stagger down the page
 * at increasing offsets to break the equal-card-grid pattern the design
 * rules prohibit.
 */
type Work = {
  name: string;
  category: string;
  year: string;
  size: string;
  href: string;
  image: string;
  aspect: string;
  colSpan: string;
  colStart: string;
  offsetTop: string;
};

const WORKS: Work[] = [
  {
    name: "Casa Horizon",
    category: "Residential Architecture",
    year: "2023",
    size: "8,400 SQ FT",
    href: "/projects/meridian-residence",
    image: STITCH_V2.home.casaHorizon,
    aspect: "aspect-video",
    colSpan: "md:col-span-9",
    colStart: "md:col-start-1",
    offsetTop: "",
  },
  {
    name: "Meridian Residence",
    category: "Design & Build",
    year: "2022",
    size: "6,200 SQ FT",
    href: "/projects/meridian-residence",
    image: STITCH_V2.home.meridian,
    aspect: "aspect-[3/4]",
    colSpan: "md:col-span-5",
    colStart: "md:col-start-8",
    offsetTop: "mt-12 md:mt-32",
  },
  {
    name: "Atelier House",
    category: "Interior Architecture",
    year: "2024",
    size: "4,100 SQ FT",
    href: "/projects/skyline-villa",
    image: STITCH_V2.home.atelier,
    aspect: "aspect-[21/9]",
    colSpan: "md:col-span-10",
    colStart: "md:col-start-2",
    offsetTop: "mt-24",
  },
];

export function SelectedWorksTeaser() {
  return (
    <section className="relative z-20 border-t border-border bg-ivory py-32">
      <div className="mx-auto max-w-[120rem] px-8 md:px-16">
        <FadeUp className="mb-24 flex items-end justify-between">
          <h2 className="font-display text-5xl font-light tracking-tighter text-charcoal md:text-7xl">
            Selected <em className="text-charcoal/50">Works</em>
          </h2>
          <NextLink
            href="/projects"
            className="hidden items-center border-b border-charcoal pb-2 font-sans text-sm uppercase tracking-widest text-charcoal transition-colors hover:text-charcoal/50 md:inline-flex"
          >
            View Full Portfolio
          </NextLink>
        </FadeUp>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16 lg:gap-24">
          {WORKS.map((work, i) => (
            <FadeUp
              key={work.name}
              delay={i * 80}
              className={cn("group relative block", work.colSpan, work.colStart, work.offsetTop)}
            >
              <NextLink href={work.href} className="block">
                <div className={cn("w-full overflow-hidden rounded bg-charcoal/5", work.aspect)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={work.image}
                    alt={work.name}
                    className="h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="mt-8 flex items-start justify-between border-t border-charcoal/10 pt-4">
                  <div>
                    <h3 className="mb-2 font-display text-3xl text-charcoal transition-colors group-hover:text-charcoal/60">
                      {work.name}
                    </h3>
                    <p className="font-sans text-sm text-text-secondary">{work.category}</p>
                  </div>
                  <div className="text-right font-sans text-xs tracking-wider text-text-secondary">
                    <span className="block">{work.year}</span>
                    <span>{work.size}</span>
                  </div>
                </div>
              </NextLink>
            </FadeUp>
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <NextLink
            href="/projects"
            className="inline-flex items-center border-b border-charcoal pb-2 font-sans text-sm uppercase tracking-widest text-charcoal"
          >
            View Full Portfolio
          </NextLink>
        </div>
      </div>
    </section>
  );
}
