"use client";

import { useRef, useState } from "react";
import NextLink from "next/link";
import { EDITORIAL } from "@/lib/editorial";
import { CountUp } from "@/components/motion/count-up";
import { EditorialCard } from "@/components/sections/editorial-card";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

const HEADLINE =
  "Timeless Elegance Crafted For Modern Living And Everyday Comfort";

const STATS = [
  { end: 80, prefix: "$", suffix: "M+", label: "Revenue Generated" },
  { end: 20, prefix: "", suffix: "K+", label: "Happy Customers" },
  { end: 98, prefix: "", suffix: "%", label: "Client Satisfaction" },
] as const;

export function TimelessIntro() {
  const rootRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const images = EDITORIAL.intro;
  const main = images[index % images.length];
  const thumbA = images[(index + 1) % images.length];
  const thumbB = images[(index + 2) % images.length];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const words = root.querySelectorAll("[data-intro=word]");
      const rest = root.querySelectorAll("[data-intro=item]");

      if (prefersReducedMotion()) {
        gsap.set([words, rest], { opacity: 1, y: 0, x: 0, filter: "blur(0px)" });
        return;
      }

      gsap.fromTo(
        words,
        { y: 28, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.045,
          ease: gsapMotion.ease.standard,
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );

      gsap.fromTo(
        rest,
        { y: 36, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.08,
          delay: 0.15,
          ease: gsapMotion.ease.standard,
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const gallery = galleryRef.current;
      if (!gallery || prefersReducedMotion()) return;

      const frames = gallery.querySelectorAll("[data-frame]");
      const tween = gsap.fromTo(
        frames,
        { x: 56, filter: "blur(14px)", opacity: 0.55 },
        {
          x: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.85,
          ease: gsapMotion.ease.standard,
          stagger: 0.06,
        },
      );

      return () => {
        tween.kill();
      };
    },
    { scope: galleryRef, dependencies: [index] },
  );

  useGSAP(
    (_context, contextSafe) => {
      if (prefersReducedMotion() || !contextSafe) return;
      const tick = contextSafe(() => {
        const gallery = galleryRef.current;
        if (!gallery) return;
        const frames = gallery.querySelectorAll("[data-frame]");
        gsap.to(frames, {
          x: -48,
          filter: "blur(16px)",
          duration: 0.45,
          ease: "power2.in",
          stagger: 0.04,
          onComplete: () => setIndex((value) => value + 1),
        });
      });
      const id = window.setInterval(tick, 4200);
      return () => window.clearInterval(id);
    },
    { scope: galleryRef, dependencies: [] },
  );

  return (
    <EditorialCard className="font-editorial" motion>
      <article ref={rootRef}>
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-start md:justify-between">
          <h2 className="max-w-4xl text-3xl font-extrabold leading-[1.12] tracking-tight text-ink-button md:text-5xl lg:text-[3.4rem]">
            {HEADLINE.split(" ").map((word, i) => (
              <span key={`${word}-${i}`} className="mr-[0.28em] inline-block overflow-hidden">
                <span data-intro="word" className="inline-block">
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <NextLink
            data-intro="item"
            href="/about"
            className="btn-press group inline-flex shrink-0 items-center gap-2 self-start rounded-md bg-ink-button px-5 py-3 text-sm font-semibold text-white"
          >
            More About Us
            <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </NextLink>
        </div>

        <div
          ref={galleryRef}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
        >
          <div data-intro="item" className="lg:col-span-7">
            <div data-frame className="overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={main}
                alt="Contemporary living room with sculptural seating"
                className="aspect-[4/3] w-full object-cover md:aspect-[16/11]"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            <div data-intro="item" className="grid grid-cols-3 gap-2 sm:gap-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <p className="text-xl font-extrabold tracking-tight text-ink-button sm:text-2xl md:text-4xl">
                    <CountUp
                      end={stat.end}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="mt-1 text-[0.68rem] leading-snug text-text-muted sm:text-xs md:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <p
              data-intro="item"
              className="max-w-md text-sm leading-relaxed text-text-secondary md:text-base"
            >
              We believe great design transforms spaces into inspiring
              environments. Our collections combine comfort, craftsmanship, and
              contemporary aesthetics to create homes you love living in.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div data-intro="item" data-frame className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbA}
                  alt="Interior detail from a recent project"
                  className="aspect-[5/4] w-full object-cover"
                />
              </div>
              <div data-intro="item" data-frame className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbB}
                  alt="Material and lighting study"
                  className="aspect-[5/4] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </EditorialCard>
  );
}
