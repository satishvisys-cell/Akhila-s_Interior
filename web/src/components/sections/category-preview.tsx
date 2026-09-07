"use client";

import { useRef, useState } from "react";
import NextLink from "next/link";
import { EDITORIAL } from "@/lib/editorial";
import { INTERIOR_SERVICES } from "@/lib/services";
import { EditorialCard } from "@/components/sections/editorial-card";
import { cn } from "@/lib/cn";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

const PREVIEWS = [
  EDITORIAL.intro[1],
  EDITORIAL.intro[2],
  EDITORIAL.services[2],
  EDITORIAL.collection[3],
  EDITORIAL.intro[3],
  EDITORIAL.collection[0],
] as const;

export function CategoryPreview() {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const firstSwap = useRef(true);
  const current = INTERIOR_SERVICES[active] ?? INTERIOR_SERVICES[0];

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const rows = root.querySelectorAll("[data-category-row]");
      gsap.fromTo(
        rows,
        { x: -40, autoAlpha: 0, filter: "blur(12px)" },
        {
          x: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          stagger: 0.09,
          duration: 0.85,
          ease: gsapMotion.ease.standard,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        },
      );

      const media = root.querySelector("[data-category-media]");
      if (media) {
        gsap.fromTo(
          media,
          {
            scale: 1.08,
            autoAlpha: 0.4,
            filter: "blur(14px)",
            clipPath: "inset(10% 8% 10% 8%)",
          },
          {
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: gsapMotion.ease.standard,
            scrollTrigger: { trigger: media, start: "top 85%", once: true },
          },
        );
      }
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const img = frameRef.current?.querySelector("img");
      if (!img) return;
      if (prefersReducedMotion() || firstSwap.current) {
        firstSwap.current = false;
        gsap.set(img, {
          scale: 1,
          autoAlpha: 1,
          filter: "none",
          clipPath: "inset(0% 0% 0% 0%)",
        });
        return;
      }
      gsap.fromTo(
        img,
        { scale: 1.1, filter: "blur(10px)", clipPath: "inset(6% 6% 6% 6%)" },
        {
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.85,
          ease: gsapMotion.ease.standard,
        },
      );
    },
    { scope: frameRef, dependencies: [active] },
  );

  return (
    <EditorialCard className="font-editorial" motion>
      <div ref={rootRef} className="grid items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <p className="mb-4 text-sm text-text-muted">All services</p>
            <ul>
              {INTERIOR_SERVICES.map((item, i) => (
                <li
                  key={item.id}
                  data-category-row
                  className="border-b border-border opacity-0 first:border-t motion-reduce:opacity-100"
                >
                  <NextLink
                    href={`/services#${item.id}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={cn(
                      "group relative flex min-h-14 items-center justify-between gap-4 py-5 pl-0 transition-[padding,background-color] duration-300",
                      active === i && "bg-black/[0.02] pl-3 md:pl-4",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-1/2 h-8 w-0.5 -translate-y-1/2 rounded-full bg-terracotta transition-opacity duration-300",
                        active === i ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xl font-medium transition-colors duration-300 md:text-2xl",
                        active === i ? "text-ink-button" : "text-text-muted",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "pointer-events-none absolute right-12 top-1/2 hidden size-14 -translate-y-1/2 rotate-12 overflow-hidden rounded-md shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:right-14 sm:size-16 md:block",
                        active === i
                          ? "scale-100 opacity-100"
                          : "scale-75 opacity-0",
                      )}
                      aria-hidden
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={PREVIEWS[i] ?? item.image}
                        alt=""
                        className="size-full object-cover"
                      />
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-lg transition-transform duration-300",
                        active === i
                          ? "-rotate-45 text-ink-button"
                          : "text-text-muted group-hover:-rotate-45",
                      )}
                    >
                      ↗
                    </span>
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
          <NextLink
            href="/services"
            className="btn-press group mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-ink-button px-5 py-3 text-sm font-semibold text-white hover:bg-black"
          >
            Explore All Services
            <span aria-hidden className="arrow-nudge">
              ↗
            </span>
          </NextLink>
        </div>
        <div
          ref={frameRef}
          data-category-media
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#f6f6f4] opacity-0 sm:aspect-[16/11] lg:col-span-7 lg:aspect-auto lg:h-full lg:min-h-[28rem] motion-reduce:opacity-100"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current.image}
            src={current.image}
            alt={current.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </EditorialCard>
  );
}
