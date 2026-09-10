import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import {
  getMediaMap,
  getPublishedProjects,
  mediaUrl,
} from "@/lib/cms/public";
import { INTERIOR_SERVICES } from "@/lib/services";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Ongoing work, project types we offer, and completed interiors by Akhila.",
};

const SECTION_NAV = [
  { href: "#ongoing", label: "Ongoing" },
  { href: "#types", label: "Types we offer" },
  { href: "#completed", label: "Completed" },
] as const;

export default async function ProjectsPage() {
  const [projects, mediaMap] = await Promise.all([
    getPublishedProjects(),
    getMediaMap(),
  ]);

  const ongoing = projects.filter((p) => p.status === "in_progress");
  const completed = projects.filter((p) => p.status === "completed");
  const planned = projects.filter((p) => p.status === "planned");

  const ongoingCards =
    ongoing.length > 0
      ? ongoing
      : planned.length > 0
        ? planned
        : [];

  return (
    <InnerPageShell>
      <EditorialCard>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <FadeUp>
            <p className="mb-2 text-sm text-text-muted">Portfolio</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-ink-button md:text-6xl">
              Projects
            </h1>
            <p className="mt-4 max-w-xl text-text-secondary">
              Follow work in progress, explore the types of interiors we deliver,
              and review completed spaces.
            </p>
          </FadeUp>
          <nav
            className="flex flex-wrap gap-2"
            aria-label="Project sections"
          >
            {SECTION_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-ink-button"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </EditorialCard>

      <EditorialCard id="ongoing">
        <FadeUp>
          <p className="mb-2 text-sm text-text-muted">01</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            Ongoing projects
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Active builds and interiors currently in progress.
          </p>
        </FadeUp>
        {ongoingCards.length === 0 ? (
          <p className="mt-10 py-8 text-center text-text-secondary">
            No ongoing projects yet. Check back soon, or{" "}
            <NextLink href="/contact" className="font-semibold text-ink-button">
              start a conversation
            </NextLink>
            .
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {ongoingCards.map((project, i) => {
              const image =
                mediaUrl(mediaMap, project.coverMediaId) ??
                STITCH_V2.live.construction;
              const href = project.liveSiteId
                ? `/live-sites/${project.slug}`
                : `/projects/${project.slug}`;
              return (
                <FadeUp key={project.id} delay={i * 60}>
                  <NextLink href={href} className="group block">
                    <div className="relative mb-4 overflow-hidden rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={project.name}
                        className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4">
                        <Badge tone="live">LIVE</Badge>
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">
                      {project.location} · In progress
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-button">
                      {project.name}
                    </h3>
                  </NextLink>
                </FadeUp>
              );
            })}
          </div>
        )}
      </EditorialCard>

      <EditorialCard id="types">
        <FadeUp>
          <p className="mb-2 text-sm text-text-muted">02</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            Types of projects we offer
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Finish disciplines composed as one interior — ceilings, power,
            colour, paper, glass, and shade.
          </p>
        </FadeUp>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INTERIOR_SERVICES.map((service, i) => (
            <FadeUp key={service.id} delay={i * 40}>
              <li>
                <NextLink
                  href={`/services#${service.id}`}
                  className="group block"
                >
                  <div className="mb-4 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt=""
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-widest text-text-muted">
                    {service.count}
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold text-ink-button">
                    {service.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                    {service.body}
                  </p>
                </NextLink>
              </li>
            </FadeUp>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <NextLink
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-button hover:opacity-70"
          >
            View all services →
          </NextLink>
        </div>
      </EditorialCard>

      <EditorialCard id="completed">
        <FadeUp>
          <p className="mb-2 text-sm text-text-muted">03</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            Completed projects
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Finished interiors ready to explore in detail.
          </p>
        </FadeUp>
        {completed.length === 0 ? (
          <p className="mt-10 py-8 text-center text-text-secondary">
            Completed projects will appear here once published.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {completed.map((project, i) => {
              const image =
                mediaUrl(mediaMap, project.coverMediaId) ??
                STITCH_V2.home.meridian;
              return (
                <FadeUp key={project.id} delay={i * 60}>
                  <NextLink
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <div className="mb-4 overflow-hidden rounded-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={project.name}
                        className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-sm text-text-muted">
                      {project.category} · {project.year} · {project.location}
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-button">
                      {project.name}
                    </h3>
                  </NextLink>
                </FadeUp>
              );
            })}
          </div>
        )}
        <div className="mt-10 text-center">
          <NextLink
            href="/designs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-button hover:opacity-70"
          >
            Browse Designs →
          </NextLink>
        </div>
      </EditorialCard>
    </InnerPageShell>
  );
}
