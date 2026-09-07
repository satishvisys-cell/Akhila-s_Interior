import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { cn } from "@/lib/cn";
import { EditorialCard } from "@/components/sections/editorial-card";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { InnerPageShell } from "@/components/layout/inner-page-shell";

export const metadata: Metadata = {
  title: "Visual Archive · Akhila",
  description:
    "A curated selection of defining interior moments — form, light, and material precision.",
};

const FILTERS = ["All", "Residential", "Commercial", "Interior"] as const;

const FRAMES = [
  {
    src: STITCH_V2.gallery.meridianExterior,
    title: "Meridian Residence",
    meta: "Exterior",
    filter: "Residential",
  },
  {
    src: STITCH_V2.tour.bathroom,
    title: "Meridian Ensuite",
    meta: "Interior",
    filter: "Interior",
  },
  {
    src: STITCH_V2.gallery.casaHorizon,
    title: "Casa Horizon",
    meta: "Coastal",
    filter: "Residential",
  },
  {
    src: STITCH_V2.tour.stairs,
    title: "Floating Staircase",
    meta: "Detail",
    filter: "Interior",
  },
  {
    src: STITCH_V2.gallery.northline,
    title: "Northline Tower",
    meta: "Commercial",
    filter: "Commercial",
  },
  {
    src: STITCH_V2.tour.living,
    title: "Coastal Living",
    meta: "Interior",
    filter: "Interior",
  },
  {
    src: STITCH_V2.gallery.workshop,
    title: "Studio Workshop",
    meta: "Creative",
    filter: "Interior",
  },
] as const;

type PageProps = { searchParams: Promise<{ filter?: string }> };

export default async function GalleryPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const active = filter ?? "All";
  const frames =
    active === "All" ? FRAMES : FRAMES.filter((f) => f.filter === active);

  return (
    <InnerPageShell>
      <EditorialCard>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm text-text-muted">Archive</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-button md:text-6xl">
              Visual Archive
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Filters">
            {FILTERS.map((f) => {
              const isActive = active === f;
              const href =
                f === "All"
                  ? "/gallery"
                  : `/gallery?filter=${encodeURIComponent(f)}`;
              return (
                <NextLink
                  key={f}
                  href={href}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-ink-button text-white"
                      : "border border-black/10 text-text-muted hover:text-ink-button",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {f}
                </NextLink>
              );
            })}
          </nav>
        </div>
      </EditorialCard>

      <EditorialCard>
        {frames.length === 0 ? (
          <p className="py-16 text-center text-text-secondary">
            No frames in this filter.
          </p>
        ) : (
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {frames.map((frame, i) => (
              <FadeUp
                key={frame.title + i}
                delay={(i % 3) * 50}
                className="mb-6 break-inside-avoid"
              >
                <figure className="group overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.src}
                    alt={frame.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <figcaption className="pt-3">
                    <p className="font-semibold text-ink-button">{frame.title}</p>
                    <p className="text-sm text-text-muted">{frame.meta}</p>
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </div>
        )}
      </EditorialCard>

      <TestimonialsCarousel />
    </InnerPageShell>
  );
}
