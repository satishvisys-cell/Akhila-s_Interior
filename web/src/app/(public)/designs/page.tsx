import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { cn } from "@/lib/cn";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import {
  getMediaMap,
  getPublishedDesigns,
  mediaUrl,
} from "@/lib/cms/public";

export const metadata: Metadata = {
  title: "Designs",
  description:
    "Studio designs uploaded and curated by Akhila — form, light, and material precision.",
};

const FILTERS = ["All", "Residential", "Commercial", "Interior"] as const;

type PageProps = { searchParams: Promise<{ filter?: string }> };

export default async function DesignsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const active = filter ?? "All";
  const [designs, mediaMap] = await Promise.all([
    getPublishedDesigns(),
    getMediaMap(),
  ]);

  const frames =
    active === "All"
      ? designs
      : designs.filter((d) =>
          d.categories.some(
            (c) => c.toLowerCase() === active.toLowerCase(),
          ),
        );

  return (
    <InnerPageShell>
      <EditorialCard>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm text-text-muted">Studio</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-button md:text-6xl">
              Designs
            </h1>
            <p className="mt-3 max-w-xl text-text-secondary">
              Our own design studies and finished compositions — managed from
              the studio admin.
            </p>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Filters">
            {FILTERS.map((f) => {
              const isActive = active === f;
              const href =
                f === "All"
                  ? "/designs"
                  : `/designs?filter=${encodeURIComponent(f)}`;
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
            No designs published yet. Upload and publish from the admin Designs
            panel.
          </p>
        ) : (
          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {frames.map((design, i) => {
              const src = mediaUrl(mediaMap, design.coverMediaId);
              if (!src) return null;
              return (
                <FadeUp
                  key={design.id}
                  delay={(i % 3) * 50}
                  className="mb-6 break-inside-avoid"
                >
                  <figure className="group overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={design.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <figcaption className="pt-3">
                      <p className="font-semibold text-ink-button">
                        {design.title}
                      </p>
                      <p className="text-sm text-text-muted">
                        {design.categories.join(" · ") ||
                          design.description ||
                          "Design"}
                      </p>
                    </figcaption>
                  </figure>
                </FadeUp>
              );
            })}
          </div>
        )}
      </EditorialCard>
    </InnerPageShell>
  );
}
