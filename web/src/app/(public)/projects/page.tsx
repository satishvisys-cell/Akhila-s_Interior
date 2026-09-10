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
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Ongoing work, project types we offer, and completed interiors by Akhila.",
};

const VIEWS = [
  { key: "ongoing", label: "Ongoing" },
  { key: "types", label: "Types we offer" },
  { key: "completed", label: "Completed" },
] as const;

type ViewKey = (typeof VIEWS)[number]["key"];

function resolveView(raw?: string): ViewKey {
  if (raw === "types" || raw === "completed" || raw === "ongoing") return raw;
  return "ongoing";
}

const VIEW_COPY: Record<
  ViewKey,
  { eyebrow: string; title: string; description: string }
> = {
  ongoing: {
    eyebrow: "01",
    title: "Ongoing projects",
    description: "Active builds and interiors currently in progress.",
  },
  types: {
    eyebrow: "02",
    title: "Types of projects we offer",
    description:
      "Finish disciplines composed as one interior — ceilings, power, colour, paper, glass, and shade.",
  },
  completed: {
    eyebrow: "03",
    title: "Completed projects",
    description: "Finished interiors ready to explore in detail.",
  },
};

type PageProps = { searchParams: Promise<{ view?: string }> };

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { view: viewParam } = await searchParams;
  const view = resolveView(viewParam);

  const [projects, mediaMap] = await Promise.all([
    getPublishedProjects(),
    getMediaMap(),
  ]);

  const ongoing = projects.filter((p) => p.status === "in_progress");
  const completed = projects.filter((p) => p.status === "completed");
  const planned = projects.filter((p) => p.status === "planned");

  const ongoingCards =
    ongoing.length > 0 ? ongoing : planned.length > 0 ? planned : [];

  const copy = VIEW_COPY[view];

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
              Choose a view — ongoing work, project types, or completed spaces.
            </p>
          </FadeUp>
          <nav
            className="flex flex-wrap gap-2"
            aria-label="Project views"
          >
            {VIEWS.map((item) => {
              const href =
                item.key === "ongoing"
                  ? "/projects"
                  : `/projects?view=${item.key}`;
              const isActive = view === item.key;
              return (
                <NextLink
                  key={item.key}
                  href={href}
                  className={cn(
                    "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-ink-button text-white"
                      : "border border-black/10 text-text-muted hover:text-ink-button",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </NextLink>
              );
            })}
          </nav>
        </div>
      </EditorialCard>

      <EditorialCard>
        <FadeUp>
          <p className="mb-2 text-sm text-text-muted">{copy.eyebrow}</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            {copy.title}
          </h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            {copy.description}
          </p>
        </FadeUp>

        {view === "ongoing" ? (
          ongoingCards.length === 0 ? (
            <p className="mt-10 py-8 text-center text-text-secondary">
              No ongoing projects yet. Check back soon, or{" "}
              <NextLink
                href="/contact"
                className="font-semibold text-ink-button"
              >
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
          )
        ) : null}

        {view === "types" ? (
          <>
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
          </>
        ) : null}

        {view === "completed" ? (
          <>
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
                          {project.category} · {project.year} ·{" "}
                          {project.location}
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
          </>
        ) : null}
      </EditorialCard>
    </InnerPageShell>
  );
}
