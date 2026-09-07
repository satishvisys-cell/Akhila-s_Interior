import type { Metadata } from "next";
import NextLink from "next/link";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { FadeUp } from "@/components/motion/fade-up";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Selected Works",
  description:
    "A curated collection of cinematic architectural spaces by Akhila.",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
] as const;

type Work = {
  name: string;
  meta: string;
  category: "residential" | "commercial";
  href: string;
  image: string;
  live?: boolean;
  span: string;
  aspect: string;
};

/** Stitch Selected Works grid — overlay-on-image editorial layout */
const WORKS: Work[] = [
  {
    name: "Casa Horizon",
    meta: "Residential · 2023",
    category: "residential",
    href: "/projects/meridian-residence",
    image: STITCH_V2.home.casaHorizon,
    span: "md:col-span-12 lg:col-span-8",
    aspect: "aspect-video",
  },
  {
    name: "Meridian Residence",
    meta: "Residential · 2022",
    category: "residential",
    href: "/projects/meridian-residence",
    image: STITCH_V2.home.meridian,
    span: "md:col-span-6 lg:col-span-4",
    aspect: "aspect-[3/4] md:aspect-auto md:min-h-[420px] lg:min-h-full",
  },
  {
    name: "Atelier House",
    meta: "Residential / Studio · 2024",
    category: "residential",
    href: "/projects/skyline-villa",
    image: STITCH_V2.home.atelier,
    span: "md:col-span-6 lg:col-span-5",
    aspect: "aspect-square md:aspect-auto md:h-[600px]",
  },
  {
    name: "Northline Tower",
    meta: "Commercial · In Progress",
    category: "commercial",
    href: "/live-sites/skyline-villa",
    image: STITCH_V2.live.construction,
    live: true,
    span: "md:col-span-12 lg:col-span-7",
    aspect: "aspect-[4/3] md:aspect-[16/9] lg:aspect-auto lg:h-[600px]",
  },
];

type PageProps = { searchParams: Promise<{ category?: string }> };

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const active = (category ?? "all").toLowerCase();
  const filtered =
    active === "all"
      ? WORKS
      : WORKS.filter((w) => w.category === active);

  return (
    <div className="flex min-h-screen flex-col bg-ivory pt-32 pb-24">
      <div className="mx-auto w-full max-w-screen-2xl px-4 md:px-8">
        <FadeUp className="mb-16 flex flex-col items-end justify-between gap-8 md:mb-24 md:flex-row">
          <h1 className="font-display text-5xl tracking-tight text-charcoal md:text-7xl lg:text-8xl">
            Selected
            <br />
            <span className="font-light italic text-accent">Works</span>
          </h1>
          <nav className="flex flex-wrap gap-3 pb-2" aria-label="Filters">
            {FILTERS.map((f) => {
              const href =
                f.key === "all" ? "/projects" : `/projects?category=${f.key}`;
              const isActive = active === f.key;
              return (
                <NextLink
                  key={f.key}
                  href={href}
                  className={cn(
                    "rounded-full border px-5 py-2 font-sans text-sm tracking-wide transition-colors",
                    isActive
                      ? "border-accent bg-accent text-text-inverse"
                      : "border-border bg-transparent text-charcoal hover:border-accent hover:text-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {f.label}
                </NextLink>
              );
            })}
          </nav>
        </FadeUp>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-text-secondary">
            No projects in this category.
          </p>
        ) : (
          <section className="grid auto-rows-min grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 lg:gap-12">
            {filtered.map((work, i) => (
              <FadeUp
                key={work.name}
                delay={i * 60}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded bg-surface",
                  work.span,
                  work.aspect,
                )}
              >
                <NextLink href={work.href} className="absolute inset-0 block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={work.image}
                    alt={work.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  {work.live ? (
                    <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded bg-live/90 px-3 py-1 shadow-sm backdrop-blur-sm">
                      <span className="size-2 animate-pulse rounded-full bg-ivory" />
                      <span className="font-sans text-xs font-bold uppercase tracking-widest text-text-inverse">
                        Live
                      </span>
                    </div>
                  ) : null}
                  <div className="absolute bottom-0 left-0 flex w-full translate-y-5 items-end justify-between p-6 opacity-0 transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 md:p-8 lg:p-10">
                    <div>
                      <p className="mb-2 font-sans text-xs uppercase tracking-widest text-text-inverse/80">
                        {work.meta}
                      </p>
                      <h2 className="font-display text-2xl text-text-inverse md:text-3xl lg:text-4xl">
                        {work.name}
                      </h2>
                    </div>
                    <span
                      className="font-sans text-3xl text-text-inverse"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </NextLink>
              </FadeUp>
            ))}
          </section>
        )}

        <div className="mt-20 text-center">
          <NextLink
            href="/gallery"
            className="inline-flex items-center gap-2 border-b border-accent pb-1 font-sans text-sm uppercase tracking-widest text-accent transition-colors hover:border-accent-hover hover:text-accent-hover"
          >
            View Archive
            <span aria-hidden>↓</span>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
