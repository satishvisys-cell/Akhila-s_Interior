import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Visual Archive · Akhila",
  description:
    "A curated selection of defining architectural moments — form, light, and material precision.",
};

const FILTERS = ["All", "Residential", "Commercial", "Interior"] as const;

const FRAMES = [
  {
    src: STITCH_V2.gallery.meridianExterior,
    title: "Meridian Residence",
    meta: "Exterior",
    height: "h-[600px]",
    filter: "Residential",
  },
  {
    src: STITCH_V2.tour.bathroom,
    title: "Meridian Ensuite",
    meta: "Interior",
    height: "h-[400px]",
    filter: "Interior",
  },
  {
    src: STITCH_V2.gallery.casaHorizon,
    title: "Casa Horizon",
    meta: "Coastal",
    height: "h-[500px]",
    filter: "Residential",
  },
  {
    src: STITCH_V2.tour.stairs,
    title: "Floating Staircase",
    meta: "Detail",
    height: "h-[450px]",
    filter: "Interior",
  },
  {
    src: STITCH_V2.gallery.northline,
    title: "Northline Tower",
    meta: "Commercial",
    height: "h-[650px]",
    filter: "Commercial",
  },
  {
    src: STITCH_V2.tour.living,
    title: "Coastal Living",
    meta: "Interior",
    height: "h-[400px]",
    filter: "Interior",
  },
  {
    src: STITCH_V2.gallery.workshop,
    title: "Studio Workshop",
    meta: "Creative",
    height: "h-[550px]",
    filter: "Interior",
  },
] as const;

type PageProps = { searchParams: Promise<{ filter?: string }> };

export default async function GalleryPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const active = filter ?? "All";
  const frames =
    active === "All"
      ? FRAMES
      : FRAMES.filter((f) => f.filter === active);

  return (
    <div className="bg-ivory text-charcoal">
      <header className="mx-auto max-w-7xl px-8 pb-16 pt-40">
        <FadeUp>
          <h1 className="mb-8 font-display text-5xl font-light tracking-tight md:text-7xl">
            Visual Archive
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="mr-4 font-sans text-sm uppercase tracking-widest text-text-secondary">
              Filter by:
            </span>
            {FILTERS.map((f) => {
              const isActive = active === f;
              const href =
                f === "All" ? "/gallery" : `/gallery?filter=${encodeURIComponent(f)}`;
              return (
                <NextLink
                  key={f}
                  href={href}
                  className={cn(
                    "rounded px-6 py-2 font-sans text-sm transition-all duration-300",
                    isActive
                      ? "bg-accent text-text-inverse hover:opacity-90"
                      : "border border-text-muted/30 text-charcoal hover:border-accent hover:text-accent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {f}
                </NextLink>
              );
            })}
          </div>
        </FadeUp>
      </header>

      <main className="mx-auto max-w-7xl px-8 pb-32">
        {frames.length === 0 ? (
          <p className="py-20 text-center text-text-secondary">
            No frames in this filter.
          </p>
        ) : (
          <div className="columns-1 gap-8 md:columns-2 lg:columns-3">
            {frames.map((frame, i) => (
              <FadeUp
                key={frame.title + i}
                delay={(i % 3) * 50}
                className="mb-8 break-inside-avoid overflow-hidden rounded bg-surface-2"
              >
                <div
                  className={cn(
                    "group relative w-full cursor-pointer overflow-hidden",
                    frame.height,
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.src}
                    alt={frame.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-end bg-black/20 p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div>
                      <p className="font-display text-2xl text-text-inverse">
                        {frame.title}
                      </p>
                      <p className="font-sans text-sm uppercase tracking-wider text-border">
                        {frame.meta}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
