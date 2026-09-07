"use client";

import { useRef } from "react";
import NextLink from "next/link";
import { EDITORIAL } from "@/lib/editorial";
import { MagneticButton } from "@/components/motion/magnetic-button";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

export function MaisonHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const words = root.querySelectorAll('[data-hero="word"]');
      const inset = root.querySelector('[data-hero="inset"]');
      const sub = root.querySelector('[data-hero="sub"]');
      const card = root.querySelector('[data-hero="card"]');
      const bg = root.querySelector('[data-hero="bg"]');

      if (prefersReducedMotion()) {
        gsap.set([words, inset, sub, card, bg], {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          filter: "none",
          clipPath: "none",
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: gsapMotion.ease.standard } });
      tl.fromTo(
        bg,
        { scale: 1.12 },
        { scale: 1, duration: 2.2, ease: "power2.out" },
        0,
      )
        .fromTo(
          words,
          { yPercent: 100, autoAlpha: 0, filter: "blur(6px)" },
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.85,
            stagger: 0.07,
          },
          0.2,
        )
        .fromTo(
          inset,
          { clipPath: "inset(0 100% 0 0)", scale: 1.12 },
          { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 0.95 },
          0.4,
        )
        .fromTo(
          sub,
          { autoAlpha: 0, y: 12, filter: "blur(5px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.65 },
          0.3,
        )
        .fromTo(
          card,
          { autoAlpha: 0, y: 22, filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.75 },
          0.5,
        );

      if (bg) {
        gsap.to(bg, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: rootRef },
  );

  const lineOne = ["Beautiful", "Homes"];
  const lineTwo = ["Start", "Right", "Here."];

  return (
    <section
      ref={rootRef}
      className="relative isolate h-[100svh] min-h-[560px] overflow-hidden text-white sm:min-h-[640px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-hero="bg"
        src={EDITORIAL.hero}
        alt="Sunlit living room with a sculptural sofa and warm timber wall"
        className="absolute left-0 top-[-12%] h-[124%] w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/45"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 pt-24 md:px-10 lg:px-14">
        <p
          data-hero="sub"
          className="mb-5 max-w-md font-editorial text-sm font-normal leading-relaxed text-white/85 md:text-base"
        >
          Curated interiors designed to elevate living spaces with calm, craft,
          and everyday comfort.
        </p>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-editorial text-[2.65rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="overflow-hidden pb-[0.2em]">
                <span data-hero="word" className="inline-block">
                  {lineOne[0]}
                </span>
              </span>
              <span
                data-hero="inset"
                className="relative mx-1 inline-block h-[0.72em] w-[1.7em] overflow-hidden rounded-md align-middle"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={EDITORIAL.heroInset}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="overflow-hidden pb-[0.2em]">
                <span data-hero="word" className="inline-block">
                  {lineOne[1]}
                </span>
              </span>
            </span>
            <span className="mt-2 flex flex-wrap gap-x-4">
              {lineTwo.map((word) => (
                <span key={word} className="overflow-hidden pb-[0.22em]">
                  <span data-hero="word" className="inline-block">
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <aside
            data-hero="card"
            className="w-full max-w-sm rounded-2xl border border-white/30 bg-white/15 p-4 shadow-xl backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 motion-reduce:hover:translate-y-0 md:p-5"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex -space-x-2">
                {EDITORIAL.avatars.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="size-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <span className="inline-flex size-8 items-center justify-center rounded-full border-2 border-white bg-white text-xs font-semibold text-ink-button">
                  +
                </span>
              </div>
              <p className="font-editorial text-sm font-medium text-white">
                Trusted by discerning clients.
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={EDITORIAL.heroCard}
              alt="Sculptural seating from a recent residence"
              className="aspect-[16/9] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.03] motion-reduce:hover:scale-100"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="/contact"
                className="btn-press focus-ring-light inline-flex min-h-11 items-center rounded-md bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink-button"
              >
                Start a Project
              </MagneticButton>
              <NextLink
                href="/projects"
                className="group focus-ring-light inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-widest text-white/80 transition-colors hover:text-white"
              >
                View works
                <span aria-hidden className="arrow-nudge ml-1">
                  →
                </span>
              </NextLink>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
