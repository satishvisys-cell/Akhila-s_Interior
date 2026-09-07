import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { getLiveSites } from "@/lib/cms/public";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { cn } from "@/lib/cn";

import { ConstructionTelemetry } from "@/components/construction/construction-telemetry";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell, PageIntro } from "@/components/layout/inner-page-shell";

export const metadata: Metadata = {
  title: "Live Sites",
  description:
    "Real-time transparency across active construction — secure monitoring without exposing credentials.",
};

const STITCH_SITES = [
  {
    slug: "skyline-villa",
    name: "Casa Horizon",
    location: "Malibu, CA",
    stage: "Structural Framing",
    day: "142",
    milestone: "Glazing",
    image: STITCH_V2.home.casaHorizon,
    featured: true,
    cta: "View Live Telemetry",
    href: "/live-sites/skyline-villa",
  },
  {
    slug: "meridian-residence",
    name: "Meridian Residence",
    location: "Beverly Hills, CA",
    stage: "Interior Finishes",
    image: STITCH_V2.home.meridian,
    featured: false,
    span: "md:col-span-7",
    cta: "View Stream",
    href: "/live-sites/skyline-villa",
  },
  {
    slug: "northline",
    name: "Northline Tower",
    location: "Urban Core",
    stage: "Foundation & Site Prep",
    image: STITCH_V2.live.construction,
    featured: false,
    span: "md:col-span-5",
    cta: "View Stream",
    href: "/live-sites/skyline-villa",
  },
] as const;

export default async function LiveSitesPage() {
  const cmsSites = await getLiveSites();
  const useStitchLayout = cmsSites.length < 2;

  return (
    <InnerPageShell>
      <PageIntro
        eyebrow="Construction"
        title="Live Site Monitoring"
        description="Real-time transparency across our active construction portfolio. Access is restricted to verified clients and project stakeholders."
      />

      <EditorialCard>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            ["Active Sites", "12"],
            ["Regional Distribution", "4 Zones"],
            ["Safety Hours", "48,200+"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="mb-1 text-sm text-text-muted">{label}</p>
              <p className="text-3xl font-extrabold tracking-tight text-ink-button">
                {value}
              </p>
            </div>
          ))}
        </div>
      </EditorialCard>

      <EditorialCard>
        {useStitchLayout ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {STITCH_SITES.map((site) =>
              site.featured ? (
                <FadeUp
                  key={site.name}
                  delay={140}
                  className="group col-span-1 overflow-hidden rounded-2xl border border-black/10 bg-white md:col-span-12 md:flex md:flex-row"
                >
                  <div className="relative h-64 overflow-hidden md:h-[500px] md:w-2/3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={site.image}
                      alt={site.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-ink/80 px-3 py-1.5 text-text-inverse backdrop-blur-sm">
                      <span className="size-2 animate-pulse rounded-full bg-live" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-8 md:w-1/3 md:p-12">
                    <div>
                      <p className="mb-4 font-sans text-xs font-bold uppercase tracking-widest text-text-muted">
                        {site.location}
                      </p>
                      <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-ink-button">{site.name}</h2>
                      <p className="mb-8 border-b border-border/30 pb-8 font-sans text-sm text-text-secondary">
                        {site.stage}
                      </p>
                      <div className="space-y-6">
                        <div>
                          <p className="mb-1 font-sans text-xs uppercase tracking-wider text-text-muted">
                            Project Day
                          </p>
                          <p className="font-sans text-lg font-medium">
                            {"day" in site ? site.day : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 font-sans text-xs uppercase tracking-wider text-text-muted">
                            Next Milestone
                          </p>
                          <p className="font-sans text-lg font-medium">
                            {"milestone" in site ? site.milestone : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <NextLink
                      href={site.href}
                      className="mt-12 flex w-full items-center justify-center gap-2 rounded-md bg-ink-button py-4 text-sm font-semibold text-white hover:bg-black"
                    >
                      <span>{site.cta}</span>
                      <span aria-hidden>→</span>
                    </NextLink>
                  </div>
                </FadeUp>
              ) : (
                <FadeUp
                  key={site.name}
                  delay={210}
                  className={cn(
                    "group overflow-hidden rounded-2xl border border-black/10 bg-white",
                    "span" in site ? site.span : "md:col-span-6",
                    site.name === "Meridian Residence"
                      ? "flex flex-col sm:flex-row"
                      : "flex flex-col",
                  )}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden",
                      site.name === "Meridian Residence"
                        ? "h-64 sm:h-[400px] sm:w-1/2"
                        : "h-48 sm:h-[220px]",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={site.image}
                      alt={site.name}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-ink/80 px-3 py-1.5 text-text-inverse backdrop-blur-sm">
                      <span className="size-2 animate-pulse rounded-full bg-live" />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Live
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex flex-grow flex-col justify-between p-8",
                      site.name === "Meridian Residence" && "sm:w-1/2",
                    )}
                  >
                    <div>
                      <p className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-text-muted">
                        {site.location}
                      </p>
                      <h3 className="mb-1 text-2xl font-extrabold text-ink-button">{site.name}</h3>
                      <p className="mb-6 font-sans text-sm text-text-secondary">
                        {site.stage}
                      </p>
                    </div>
                    <NextLink
                      href={site.href}
                      className="mt-4 w-full rounded-md bg-ink-button py-3 text-center text-sm font-semibold text-white hover:bg-black"
                    >
                      {site.cta}
                    </NextLink>
                  </div>
                </FadeUp>
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {cmsSites.map((site, i) => {
              const isFeatured = i === 0;
              const cover =
                STITCH_SITES[i % STITCH_SITES.length]?.image ??
                STITCH_V2.home.casaHorizon;
              const name = site.slug.replace(/-/g, " ");
              return (
                <FadeUp
                  key={site.id}
                  delay={i * 50}
                  className={cn(
                    "group overflow-hidden rounded-2xl border border-black/10 bg-white",
                    isFeatured
                      ? "md:col-span-12 md:flex md:flex-row"
                      : i % 2 === 1
                        ? "md:col-span-7"
                        : "md:col-span-5",
                  )}
                >
                  <NextLink
                    href={`/live-sites/${site.slug}`}
                    className={cn(
                      "flex h-full flex-col no-underline",
                      isFeatured && "md:flex-row",
                    )}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden",
                        isFeatured
                          ? "h-64 md:h-[500px] md:w-2/3"
                          : "h-64 sm:h-[360px]",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-ink/80 px-3 py-1.5 text-text-inverse backdrop-blur-sm">
                        <span className="size-2 animate-pulse rounded-full bg-live" />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Live
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col justify-between p-8",
                        isFeatured && "md:w-1/3 md:p-12",
                      )}
                    >
                      <div>
                        <p className="mb-4 font-sans text-xs font-bold uppercase tracking-widest text-text-muted">
                          {site.location}
                        </p>
                        <h2 className="mb-2 text-3xl font-extrabold capitalize tracking-tight text-ink-button">
                          {name}
                        </h2>
                        <p className="mb-8 border-b border-border/30 pb-8 font-sans text-sm text-text-secondary">
                          {site.stageLabel}
                        </p>
                      </div>
                      <span className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink-button py-4 text-sm font-semibold text-white group-hover:bg-black">
                        View Stream →
                      </span>
                    </div>
                  </NextLink>
                </FadeUp>
              );
            })}
          </div>
        )}
      </EditorialCard>

      <ConstructionTelemetry />
    </InnerPageShell>
  );
}
