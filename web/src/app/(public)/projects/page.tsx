import type { Metadata } from "next";
import NextLink from "next/link";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { FadeUp } from "@/components/motion/fade-up";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Selected Works",
  description:
    "A curated collection of cinematic interior spaces by Akhila.",
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
};

const WORKS: Work[] = [
  {
    name: "Casa Horizon",
    meta: "Residential · 2023",
    category: "residential",
    href: "/projects/meridian-residence",
    image: STITCH_V2.home.casaHorizon,
  },
  {
    name: "Meridian Residence",
    meta: "Residential · 2022",
    category: "residential",
    href: "/projects/meridian-residence",
    image: STITCH_V2.home.meridian,
  },
  {
    name: "Atelier House",
    meta: "Residential / Studio · 2024",
    category: "residential",
    href: "/projects/skyline-villa",
    image: STITCH_V2.home.atelier,
  },
  {
    name: "Northline Tower",
    meta: "Commercial · In Progress",
    category: "commercial",
    href: "/live-sites/skyline-villa",
    image: STITCH_V2.live.construction,
    live: true,
  },
];

type PageProps = { searchParams: Promise<{ category?: string }> };

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const active = (category ?? "all").toLowerCase();
  const filtered =
    active === "all" ? WORKS : WORKS.filter((w) => w.category === active);

  return (
    <InnerPageShell>
      <EditorialCard>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <FadeUp>
            <p className="mb-2 text-sm text-text-muted">Portfolio</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-button md:text-6xl">
              Selected Works
            </h1>
          </FadeUp>
          <nav className="flex flex-wrap gap-2" aria-label="Filters">
            {FILTERS.map((f) => {
              const href =
                f.key === "all" ? "/projects" : `/projects?category=${f.key}`;
              const isActive = active === f.key;
              return (
                <NextLink
                  key={f.key}
                  href={href}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-ink-button text-white"
                      : "border border-black/10 text-text-muted hover:text-ink-button",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {f.label}
                </NextLink>
              );
            })}
          </nav>
        </div>
      </EditorialCard>

      <EditorialCard>
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-text-secondary">
            No projects in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((work, i) => (
              <FadeUp key={work.name} delay={i * 60}>
                <NextLink href={work.href} className="group block">
                  <div className="relative mb-4 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={work.image}
                      alt={work.name}
                      className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {work.live ? (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-ink-button/85 px-3 py-1 text-xs font-semibold text-white">
                        <span className="size-1.5 animate-pulse rounded-full bg-white" />
                        Live
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-text-muted">{work.meta}</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-button">
                    {work.name}
                  </h2>
                </NextLink>
              </FadeUp>
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <NextLink
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-button hover:opacity-70"
          >
            View Archive →
          </NextLink>
        </div>
      </EditorialCard>
    </InnerPageShell>
  );
}
