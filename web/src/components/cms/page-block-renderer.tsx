import NextLink from "next/link";
import Image from "next/image";
import { FadeUp } from "@/components/motion/fade-up";
import { MagneticButton } from "@/components/motion/magnetic-button";
import type { ResolvedBlock } from "@/lib/cms/resolve-blocks";

/**
 * The reusable renderer half of:
 *   Page -> Sections -> Section Type -> Section Data -> Reusable Renderer
 *
 * Takes already-resolved blocks (see `resolvePageBlocks`) and renders real
 * production markup — the same component tree used by both the public
 * `/[slug]` route AND the admin preview, so "Preview" is never a lie.
 *
 * Blocks with no usable data (empty gallery, unresolved hero, etc.) render
 * nothing rather than a fake placeholder — see "no fake features" rule.
 */
export function PageBlockRenderer({ blocks }: { blocks: ResolvedBlock[] }) {
  return (
    <>
      {blocks
        .filter((b) => b.visible)
        .map((block) => (
          <BlockSection key={block.id} block={block} />
        ))}
    </>
  );
}

function BlockSection({ block }: { block: ResolvedBlock }) {
  switch (block.type) {
    case "hero":
      return <HeroBlock block={block} />;
    case "text":
      return <TextBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "gallery":
      return <GalleryBlock block={block} />;
    case "project_grid":
      return <ProjectGridBlock block={block} />;
    case "statistics":
      return <StatisticsBlock block={block} />;
    case "timeline":
      return <TimelineBlock block={block} />;
    case "master_tour":
      return <MasterTourBlock block={block} />;
    case "room_explorer":
      return <RoomExplorerBlock block={block} />;
    case "live_cctv":
      return <LiveCctvBlock block={block} />;
    case "construction_progress":
      return <ConstructionProgressBlock block={block} />;
    case "cta":
      return <CtaBlock block={block} />;
    case "faq":
      return <FaqBlock block={block} />;
    case "testimonials":
    case "team":
      // No CMS collection wired for these yet — render nothing rather than
      // fabricate content (tracked gap, see docs/STATUS.md).
      return null;
    case "html":
      return block.html ? (
        <section
          className="mx-auto max-w-4xl px-8 py-16"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      ) : null;
    default:
      return null;
  }
}

function BlockShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`w-full ${className}`}>{children}</section>;
}

function HeroBlock({ block }: { block: Extract<ResolvedBlock, { type: "hero" }> }) {
  const { hero, media } = block;
  if (!hero) return null;
  const align =
    hero.alignment === "center"
      ? "items-center text-center"
      : hero.alignment === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <BlockShell className="relative flex h-[100svh] overflow-hidden bg-charcoal">
      {media ? (
        <div className="absolute inset-0 z-0" aria-hidden>
          <div
            className="absolute inset-0 z-10 bg-charcoal"
            style={{ opacity: hero.overlayStrength }}
          />
          <Image
            src={media.url}
            alt={media.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className={`relative z-20 mx-auto flex w-full max-w-7xl flex-col justify-center px-8 ${align}`}>
        <FadeUp className="max-w-3xl">
          {hero.eyebrow ? (
            <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-text-inverse/80">
              {hero.eyebrow}
            </p>
          ) : null}
          <h1 className="mb-6 font-display text-5xl font-light leading-[1.05] text-text-inverse md:text-7xl">
            {hero.heading}
          </h1>
          {hero.subtitle ? (
            <p className="mb-4 font-sans text-lg text-text-inverse/85">{hero.subtitle}</p>
          ) : null}
          {hero.description ? (
            <p className="mb-10 max-w-xl font-sans text-base font-light leading-relaxed text-text-inverse/70">
              {hero.description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-6">
            {hero.primaryCta ? (
              <MagneticButton
                href={hero.primaryCta.href}
                className="items-center justify-center rounded bg-accent px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-text-inverse hover:bg-accent-hover"
              >
                {hero.primaryCta.label}
              </MagneticButton>
            ) : null}
            {hero.secondaryCta ? (
              <NextLink
                href={hero.secondaryCta.href}
                className="font-sans text-xs font-bold uppercase tracking-widest text-text-inverse hover:text-accent"
              >
                {hero.secondaryCta.label} →
              </NextLink>
            ) : null}
          </div>
        </FadeUp>
      </div>
    </BlockShell>
  );
}

function TextBlock({ block }: { block: Extract<ResolvedBlock, { type: "text" }> }) {
  const align = block.alignment === "center" ? "text-center mx-auto" : block.alignment === "right" ? "text-right ml-auto" : "";
  return (
    <BlockShell className="bg-ivory py-24">
      <FadeUp className={`mx-auto max-w-3xl px-8 ${align}`}>
        {block.heading ? (
          <h2 className="mb-6 font-display text-4xl font-light text-charcoal md:text-5xl">{block.heading}</h2>
        ) : null}
        <p className="whitespace-pre-line font-sans text-lg font-light leading-relaxed text-text-secondary">{block.body}</p>
      </FadeUp>
    </BlockShell>
  );
}

function ImageBlock({ block }: { block: Extract<ResolvedBlock, { type: "image" }> }) {
  if (!block.media) return null;
  return (
    <BlockShell className="bg-ivory py-16">
      <FadeUp className={block.fullBleed ? "" : "mx-auto max-w-6xl px-8"}>
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image src={block.media.url} alt={block.media.alt} fill sizes="100vw" className="object-cover" />
        </div>
        {block.caption ? (
          <p className="mt-3 px-8 font-sans text-xs uppercase tracking-widest text-text-muted">{block.caption}</p>
        ) : null}
      </FadeUp>
    </BlockShell>
  );
}

function VideoBlock({ block }: { block: Extract<ResolvedBlock, { type: "video" }> }) {
  if (!block.media) return null;
  return (
    <BlockShell className="bg-ink py-16">
      <FadeUp className="mx-auto max-w-6xl px-8">
        <video
          src={block.media.url}
          poster={block.poster?.url}
          autoPlay={block.autoplay}
          loop={block.loop}
          muted={block.muted ?? true}
          controls={!block.autoplay}
          playsInline
          className="aspect-video w-full bg-black object-cover"
        />
      </FadeUp>
    </BlockShell>
  );
}

function GalleryBlock({ block }: { block: Extract<ResolvedBlock, { type: "gallery" }> }) {
  if (block.items.length === 0) return null;
  return (
    <BlockShell className="bg-ivory py-24">
      <div
        className="mx-auto grid max-w-7xl gap-4 px-8"
        style={{ gridTemplateColumns: `repeat(${Math.min(block.columns, 4)}, minmax(0, 1fr))` }}
      >
        {block.items.map((item, i) => (
          <FadeUp key={item.url} delay={i * 50} className="relative aspect-[4/5] overflow-hidden bg-surface-2">
            <Image src={item.url} alt={item.alt} fill sizes="33vw" className="object-cover" />
          </FadeUp>
        ))}
      </div>
    </BlockShell>
  );
}

function ProjectGridBlock({ block }: { block: Extract<ResolvedBlock, { type: "project_grid" }> }) {
  if (block.projects.length === 0) return null;
  return (
    <BlockShell className="bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-8">
        {block.heading ? (
          <FadeUp>
            <h2 className="mb-12 font-display text-4xl font-light text-charcoal md:text-5xl">{block.heading}</h2>
          </FadeUp>
        ) : null}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {block.projects.map((project, i) => (
            <FadeUp key={project.id} delay={i * 60}>
              <NextLink href={`/projects/${project.slug}`} className="group block">
                <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-surface-2">
                  {project.coverUrl ? (
                    <Image
                      src={project.coverUrl}
                      alt={project.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <h3 className="font-display text-xl font-light text-charcoal">{project.name}</h3>
                <p className="font-sans text-xs uppercase tracking-widest text-text-muted">{project.location}</p>
              </NextLink>
            </FadeUp>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

function StatisticsBlock({ block }: { block: Extract<ResolvedBlock, { type: "statistics" }> }) {
  if (block.items.length === 0) return null;
  return (
    <BlockShell className="border-y border-border bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-8">
        {block.heading ? <h2 className="mb-12 font-display text-3xl font-light text-charcoal">{block.heading}</h2> : null}
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:divide-x md:divide-border">
          {block.items.map((item, i) => (
            <FadeUp key={`${item.label}-${i}`} delay={i * 70} className="text-center md:px-8 md:text-left">
              <h3 className="mb-2 font-display text-5xl font-light text-charcoal">
                {item.value}
                {item.suffix ?? ""}
              </h3>
              <p className="font-sans text-xs uppercase tracking-widest text-text-muted">{item.label}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

function TimelineBlock({ block }: { block: Extract<ResolvedBlock, { type: "timeline" }> }) {
  if (block.events.length === 0) return null;
  return (
    <BlockShell className="bg-ivory py-24">
      <div className="mx-auto max-w-4xl px-8">
        {block.heading ? <h2 className="mb-12 font-display text-4xl font-light text-charcoal">{block.heading}</h2> : null}
        <ol className="space-y-10 border-l border-border pl-8">
          {block.events.map((event) => (
            <li key={event.id} className="relative">
              <span className="absolute -left-[calc(2rem+4px)] top-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
              <p className="font-mono text-xs uppercase tracking-widest text-accent">{event.date}</p>
              <h3 className="mt-1 font-display text-xl text-charcoal">{event.title}</h3>
              {event.description ? <p className="mt-2 font-sans text-sm text-text-secondary">{event.description}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </BlockShell>
  );
}

function MasterTourBlock({ block }: { block: Extract<ResolvedBlock, { type: "master_tour" }> }) {
  if (!block.tour || block.tour.resolvedScenes.length === 0) return null;
  return (
    <BlockShell className="bg-ink py-24 text-text-inverse">
      <div className="mx-auto max-w-7xl px-8">
        <h2 className="mb-12 font-display text-4xl font-light">{block.heading ?? block.tour.title}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {block.tour.resolvedScenes.map((scene) => (
            <FadeUp key={scene.id} className="relative aspect-[3/4] overflow-hidden bg-white/5">
              {scene.media ? (
                <Image src={scene.media.url} alt={scene.media.alt} fill sizes="25vw" className="object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 font-sans text-xs uppercase tracking-widest">
                {String(scene.index).padStart(2, "0")} — {scene.label}
              </span>
            </FadeUp>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

function RoomExplorerBlock({ block }: { block: Extract<ResolvedBlock, { type: "room_explorer" }> }) {
  if (block.rooms.length === 0) return null;
  return (
    <BlockShell className="bg-ivory py-24">
      <div className="mx-auto max-w-7xl px-8">
        {block.heading ? <h2 className="mb-12 font-display text-4xl font-light text-charcoal">{block.heading}</h2> : null}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {block.rooms.map((room) => {
            const cover = room.resolvedStates.find((s) => s.media)?.media;
            return (
              <FadeUp key={room.id} className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                {cover ? <Image src={cover.url} alt={cover.alt} fill sizes="50vw" className="object-cover" /> : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="font-display text-2xl font-light text-white">{room.name}</h3>
                  {room.areaSqm ? <p className="font-sans text-xs uppercase tracking-widest text-white/70">{room.areaSqm} m²</p> : null}
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </BlockShell>
  );
}

function LiveCctvBlock({ block }: { block: Extract<ResolvedBlock, { type: "live_cctv" }> }) {
  const site = block.liveSite;
  if (!site) return null;
  const cameras = site.cameras.filter((c) => c.visibility === "public").slice(0, block.maxCameras ?? site.cameras.length);
  if (cameras.length === 0) return null;

  return (
    <BlockShell className="bg-ink py-24 text-text-inverse">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="font-display text-3xl font-light">{block.heading ?? site.location}</h2>
          <span className="inline-flex items-center rounded bg-live/10 px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest text-live">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-live" aria-hidden />
            {site.stageLabel} — {site.percent}%
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cameras.map((camera) => (
            <div key={camera.id} className="flex aspect-video items-center justify-center border border-white/10 bg-white/5 font-sans text-xs uppercase tracking-widest text-white/50">
              {camera.name} — {camera.status === "live" ? "Requires authenticated session" : camera.status}
            </div>
          ))}
        </div>
        <p className="mt-6 font-sans text-xs text-white/40">
          Live feeds require server-authorized streaming sessions — no camera credentials are exposed to this page.
        </p>
      </div>
    </BlockShell>
  );
}

function ConstructionProgressBlock({ block }: { block: Extract<ResolvedBlock, { type: "construction_progress" }> }) {
  const progress = block.progress;
  if (!progress) return null;
  return (
    <BlockShell className="bg-ivory py-24">
      <div className="mx-auto max-w-4xl px-8">
        <h2 className="mb-2 font-display text-4xl font-light text-charcoal">{block.heading ?? "Construction Progress"}</h2>
        <p className="mb-10 font-sans text-sm text-text-muted">{progress.percent}% overall</p>
        {block.showStages ? (
          <ul className="space-y-4">
            {progress.stages.map((stage) => (
              <li key={stage.key}>
                <div className="mb-1 flex items-center justify-between font-sans text-xs uppercase tracking-widest text-charcoal">
                  <span>{stage.key.replace(/_/g, " ")}</span>
                  <span>{stage.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-border">
                  <div className="h-1.5 bg-accent" style={{ width: `${stage.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </BlockShell>
  );
}

function CtaBlock({ block }: { block: Extract<ResolvedBlock, { type: "cta" }> }) {
  return (
    <BlockShell className="relative overflow-hidden bg-charcoal py-32 text-text-inverse">
      {block.background ? (
        <div className="absolute inset-0 z-0 opacity-30" aria-hidden>
          <Image src={block.background.url} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      ) : null}
      <FadeUp className="relative z-10 mx-auto max-w-3xl px-8 text-center">
        <h2 className="mb-6 font-display text-5xl font-light leading-tight md:text-6xl">{block.heading}</h2>
        {block.description ? <p className="mb-10 font-sans text-lg font-light text-text-inverse/80">{block.description}</p> : null}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <MagneticButton
            href={block.primaryCta.href}
            className="items-center justify-center rounded bg-accent px-10 py-5 font-sans text-xs font-bold uppercase tracking-widest hover:bg-accent-hover"
          >
            {block.primaryCta.label}
          </MagneticButton>
          {block.secondaryCta ? (
            <NextLink href={block.secondaryCta.href} className="font-sans text-xs font-bold uppercase tracking-widest hover:text-accent">
              {block.secondaryCta.label} →
            </NextLink>
          ) : null}
        </div>
      </FadeUp>
    </BlockShell>
  );
}

function FaqBlock({ block }: { block: Extract<ResolvedBlock, { type: "faq" }> }) {
  if (block.items.length === 0) return null;
  return (
    <BlockShell className="bg-ivory py-24">
      <div className="mx-auto max-w-3xl px-8">
        {block.heading ? <h2 className="mb-10 font-display text-4xl font-light text-charcoal">{block.heading}</h2> : null}
        <dl className="divide-y divide-border">
          {block.items.map((item) => (
            <div key={item.id} className="py-6">
              <dt className="font-display text-lg text-charcoal">{item.question}</dt>
              <dd className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </BlockShell>
  );
}
