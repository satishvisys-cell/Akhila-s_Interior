"use client";

import { useRef } from "react";
import NextLink from "next/link";
import { EDITORIAL } from "@/lib/editorial";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { EditorialCard } from "@/components/sections/editorial-card";
import { FadeUp } from "@/components/motion/fade-up";
import { gsap, useGSAP } from "@/lib/motion/gsap-client";

type LiveProject = {
  name: string;
  location: string;
  stage: string;
  image: string;
  href: string;
};

const LIVE_PROJECTS: readonly LiveProject[] = [
  {
    name: "Casa Horizon",
    location: "Malibu, CA",
    stage: "Structural Framing",
    image: STITCH_V2.home.casaHorizon,
    href: "/live-sites/skyline-villa",
  },
  {
    name: "Meridian Residence",
    location: "Beverly Hills, CA",
    stage: "Interior Finishes",
    image: STITCH_V2.home.meridian,
    href: "/live-sites/skyline-villa",
  },
  {
    name: "Atelier House",
    location: "Los Angeles, CA",
    stage: "Joinery & Fit-Out",
    image: STITCH_V2.home.atelier,
    href: "/live-sites/skyline-villa",
  },
  {
    name: "Northline Tower",
    location: "Urban Core",
    stage: "Foundation & Site Prep",
    image: STITCH_V2.live.construction,
    href: "/live-sites/skyline-villa",
  },
  {
    name: "Gallery Lamp Suite",
    location: "Studio Works",
    stage: "Lighting Install",
    image: EDITORIAL.rooms.light,
    href: "/live-sites",
  },
  {
    name: "Coastal Living Wing",
    location: "Malibu, CA",
    stage: "Painting & Paper",
    image: EDITORIAL.rooms.living,
    href: "/live-sites",
  },
];

const SPEED_PX_PER_SEC = 42;

export function LiveProjectsCarousel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track || !contextSafe) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(track, { x: 0, clearProps: "transform" });
        root.classList.add("overflow-x-auto");
        return () => root.classList.remove("overflow-x-auto");
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const firstSet = track.querySelector<HTMLElement>("[data-carousel-set]");
        if (!firstSet) return;

        let tween: gsap.core.Tween | null = null;
        let paused = false;
        let dragging = false;
        let startX = 0;
        let startOffset = 0;

        const build = () => {
          tween?.kill();
          gsap.set(track, { x: 0 });
          const distance = firstSet.offsetWidth;
          if (distance < 8) return;

          const duration = distance / SPEED_PX_PER_SEC;
          tween = gsap.to(track, {
            x: -distance,
            duration,
            ease: "none",
            repeat: -1,
          });
          if (paused) tween.pause();
        };

        build();

        const pause = contextSafe(() => {
          paused = true;
          tween?.pause();
        });
        const play = contextSafe(() => {
          if (dragging) return;
          paused = false;
          tween?.play();
        });

        root.addEventListener("mouseenter", pause);
        root.addEventListener("mouseleave", play);
        root.addEventListener("focusin", pause);
        root.addEventListener("focusout", (e) => {
          if (!root.contains(e.relatedTarget as Node | null)) play();
        });

        let dragDistance = 0;

        const onPointerDown = contextSafe((e: PointerEvent) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          dragging = true;
          dragDistance = 0;
          startX = e.clientX;
          startOffset = Number(gsap.getProperty(track, "x")) || 0;
          pause();
          root.setPointerCapture(e.pointerId);
          root.style.cursor = "grabbing";
        });

        const onPointerMove = contextSafe((e: PointerEvent) => {
          if (!dragging || !tween) return;
          const distance = firstSet.offsetWidth;
          if (distance < 8) return;
          const delta = e.clientX - startX;
          dragDistance = Math.abs(delta);
          let next = startOffset + delta;
          next = ((next % -distance) + -distance) % -distance;
          if (next > 0) next -= distance;
          gsap.set(track, { x: next });
          const progress = Math.abs(next) / distance;
          tween.progress(progress).pause();
        });

        const onPointerUp = contextSafe((e: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          root.style.cursor = "";
          try {
            root.releasePointerCapture(e.pointerId);
          } catch {
            /* already released */
          }
          if (dragDistance > 8) {
            // Suppress the click that follows a real drag
            const blockClick = (ev: Event) => {
              ev.preventDefault();
              ev.stopPropagation();
              root.removeEventListener("click", blockClick, true);
            };
            root.addEventListener("click", blockClick, true);
            window.setTimeout(() => {
              root.removeEventListener("click", blockClick, true);
            }, 0);
          }
          window.setTimeout(() => {
            if (!root.matches(":hover") && !root.contains(document.activeElement)) {
              play();
            }
          }, 400);
        });

        root.addEventListener("pointerdown", onPointerDown);
        root.addEventListener("pointermove", onPointerMove);
        root.addEventListener("pointerup", onPointerUp);
        root.addEventListener("pointercancel", onPointerUp);

        const onResize = contextSafe(() => build());
        window.addEventListener("resize", onResize);

        return () => {
          tween?.kill();
          root.removeEventListener("mouseenter", pause);
          root.removeEventListener("mouseleave", play);
          root.removeEventListener("focusin", pause);
          root.removeEventListener("pointerdown", onPointerDown);
          root.removeEventListener("pointermove", onPointerMove);
          root.removeEventListener("pointerup", onPointerUp);
          root.removeEventListener("pointercancel", onPointerUp);
          window.removeEventListener("resize", onResize);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <EditorialCard className="overflow-hidden font-editorial" motion>
      <FadeUp className="mx-auto mb-8 max-w-2xl px-1 text-center sm:mb-10">
        <p className="mb-2 text-sm text-text-muted">Projects</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-ink-button sm:text-4xl md:text-5xl">
          Ongoing work
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
          Active fit-out sites in progress — explore the full hub on Projects.
        </p>
      </FadeUp>

      <div
        ref={rootRef}
        className="relative -mx-2 cursor-grab overflow-hidden touch-pan-y md:-mx-3 active:cursor-grabbing"
        aria-roledescription="carousel"
        aria-label="Live projects. Drag to explore."
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              data-carousel-set
              className="flex shrink-0 gap-4 px-2 sm:gap-5 md:gap-6 md:px-3"
              aria-hidden={setIndex > 0}
            >
              {LIVE_PROJECTS.map((project) => (
                <ProjectCard
                  key={`${setIndex}-${project.name}`}
                  project={project}
                  inert={setIndex > 0}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <NextLink
          href="/projects#ongoing"
          className="btn-press group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink-button hover:text-terracotta"
        >
          View ongoing projects
          <span aria-hidden className="arrow-nudge">
            →
          </span>
        </NextLink>
      </div>
    </EditorialCard>
  );
}

function ProjectCard({
  project,
  inert = false,
}: {
  project: LiveProject;
  inert?: boolean;
}) {
  return (
    <article className="w-[min(72vw,260px)] shrink-0 sm:w-[260px] md:w-[300px]">
      <NextLink
        href={project.href}
        className="group block transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0"
        tabIndex={inert ? -1 : undefined}
        aria-hidden={inert || undefined}
        draggable={false}
      >
        <div className="relative mb-4 overflow-hidden rounded-xl bg-[#f6f6f4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt=""
            draggable={false}
            className="motion-image-zoom aspect-[4/5] w-full object-cover"
          />
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/15 bg-ink/80 px-3 py-1.5 text-white backdrop-blur-sm">
            <span className="size-2 animate-pulse rounded-full bg-live" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>
        <p className="text-xs uppercase tracking-widest text-text-muted">
          {project.location}
        </p>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-ink-button transition-colors group-hover:text-terracotta">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">{project.stage}</p>
      </NextLink>
    </article>
  );
}
