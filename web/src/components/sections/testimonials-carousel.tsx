"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import NextLink from "next/link";
import { EditorialCard } from "@/components/sections/editorial-card";
import {
  CLIENT_TESTIMONIALS,
  type ClientTestimonial,
} from "@/lib/testimonials";
import { cn } from "@/lib/cn";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

const AUTOPLAY_SECONDS = 7;

export function TestimonialsCarousel({
  testimonials = CLIENT_TESTIMONIALS,
}: {
  testimonials?: readonly ClientTestimonial[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef(1);
  const pointerStartX = useRef<number | null>(null);
  const hasAnimated = useRef(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = testimonials.length;
  const current = testimonials[index];

  const go = useCallback(
    (nextIndex: number, direction: number) => {
      if (count === 0) return;
      directionRef.current = direction;
      setIndex((nextIndex + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => go(index + 1, 1), [go, index]);
  const goPrev = useCallback(() => go(index - 1, -1), [go, index]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      if (prefersReducedMotion() || !hasAnimated.current) {
        hasAnimated.current = true;
        gsap.set(panel, { autoAlpha: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        panel,
        { autoAlpha: 0.18, x: directionRef.current * 28 },
        {
          autoAlpha: 1,
          x: 0,
          duration: gsapMotion.duration.fast,
          ease: gsapMotion.ease.standard,
          overwrite: "auto",
        },
      );
    },
    { scope: rootRef, dependencies: [index] },
  );

  useGSAP(
    (_context, contextSafe) => {
      if (count < 2 || paused || prefersReducedMotion() || !contextSafe) return;

      const advance = contextSafe(() => go(index + 1, 1));
      const delayed = gsap.delayedCall(AUTOPLAY_SECONDS, advance);

      return () => {
        delayed.kill();
      };
    },
    {
      scope: rootRef,
      dependencies: [index, paused, count, go],
    },
  );

  if (count === 0) {
    return (
      <EditorialCard className="font-editorial">
        <p className="text-sm text-text-muted">Clients</p>
        <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-button md:text-5xl">
          Client Voices
        </h2>
        <p className="mt-6 text-text-secondary">
          Testimonials will appear here as completed interiors are published.
        </p>
      </EditorialCard>
    );
  }

  return (
    <EditorialCard className="font-editorial">
      <section
        ref={rootRef}
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setPaused(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goNext();
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goPrev();
          }
        }}
        tabIndex={0}
        className="outline-none"
      >
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm text-text-muted">Clients</p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-button md:text-5xl">
              Voices from the rooms we finish
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary md:text-base">
              Private notes from homeowners and stakeholders after handover —
              the measure of an interior is how it is lived in.
            </p>
          </div>
          {count > 1 ? (
            <div className="flex items-center gap-2">
              <CarouselButton label="Previous testimonial" onClick={goPrev}>
                ←
              </CarouselButton>
              <CarouselButton label="Next testimonial" onClick={goNext}>
                →
              </CarouselButton>
            </div>
          ) : null}
        </div>

        <div
          ref={panelRef}
          className="touch-pan-y will-change-transform"
          onPointerDown={(event) => {
            pointerStartX.current = event.clientX;
          }}
          onPointerUp={(event) => {
            if (pointerStartX.current == null) return;
            const delta = event.clientX - pointerStartX.current;
            pointerStartX.current = null;
            if (delta > 56) goPrev();
            if (delta < -56) goNext();
          }}
        >
          <article className="grid items-stretch gap-8 lg:grid-cols-12">
            <div className="flex flex-col justify-between lg:col-span-7">
              <blockquote className="max-w-2xl">
                <p
                  className="text-2xl font-medium leading-snug tracking-tight text-ink-button md:text-4xl md:leading-[1.2]"
                  aria-live="polite"
                >
                  “{current.quote}”
                </p>
              </blockquote>
              <footer className="mt-10 border-t border-border pt-6">
                <p className="text-base font-semibold text-ink-button">
                  {current.author}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {current.role} · {current.project}, {current.location}
                </p>
                <NextLink
                  href={current.href}
                  className="mt-4 inline-flex text-sm font-semibold text-ink-button transition-opacity hover:opacity-70"
                >
                  View project →
                </NextLink>
              </footer>
            </div>

            <figure className="overflow-hidden rounded-2xl lg:col-span-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.image}
                alt={current.imageAlt}
                className="aspect-[4/5] h-full w-full object-cover md:aspect-[5/4] lg:aspect-[4/5]"
              />
            </figure>
          </article>
        </div>

        {count > 1 ? (
          <div
            className="mt-8 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Choose a testimonial"
          >
            {testimonials.map((item, i) => {
              const isActive = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show testimonial from ${item.author}`}
                  onClick={() => go(i, i > index ? 1 : -1)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    isActive
                      ? "w-8 bg-ink-button"
                      : "w-2 bg-black/20 hover:bg-black/40",
                  )}
                />
              );
            })}
          </div>
        ) : null}

        <p className="sr-only" aria-live="polite">
          Testimonial {index + 1} of {count}
        </p>
      </section>
    </EditorialCard>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-md bg-ink-button text-sm font-semibold text-white transition-opacity hover:opacity-90"
    >
      {children}
    </button>
  );
}
