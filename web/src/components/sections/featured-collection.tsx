"use client";

import { useRef } from "react";
import NextLink from "next/link";
import { EDITORIAL } from "@/lib/editorial";
import { EditorialCard } from "@/components/sections/editorial-card";
import { ParallaxImage } from "@/components/motion/parallax-image";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

const ITEMS = [
  { name: "Horizon Sofa", meta: "Casa Horizon · Living", href: "/projects/meridian-residence", image: EDITORIAL.collection[0] },
  { name: "Studio Stool", meta: "Atelier House · Details", href: "/projects/skyline-villa", image: EDITORIAL.collection[1] },
  { name: "Meridian Chair", meta: "Meridian Residence · Dining", href: "/projects/meridian-residence", image: EDITORIAL.collection[2] },
  { name: "Gallery Lamp", meta: "Lighting Studies", href: "/designs", image: EDITORIAL.collection[3] },
] as const;

export function FeaturedCollection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const title = root.querySelector("[data-collection=title]");
      const items = root.querySelectorAll("[data-collection=item]");

      if (prefersReducedMotion()) {
        gsap.set([title, items], { opacity: 1, y: 0, x: 0, filter: "none" });
        return;
      }
      gsap.fromTo(
        title,
        { x: 24, filter: "blur(6px)", opacity: 0 },
        {
          x: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.7,
          ease: gsapMotion.ease.enter,
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        },
      );
      gsap.fromTo(
        items,
        { y: 28, filter: "blur(5px)", opacity: 0 },
        {
          y: 0,
          filter: "blur(0px)",
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          delay: 0.08,
          ease: gsapMotion.ease.enter,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <EditorialCard className="bg-[#f6f6f4] font-editorial" motion>
      <article ref={rootRef}>
        <p className="text-sm text-text-muted">Best Selling</p>
        <h2
          data-collection="title"
          className="mb-8 translate-x-5 text-3xl font-extrabold tracking-tight text-ink-button opacity-0 blur-[4px] sm:mb-10 sm:text-4xl md:text-5xl motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:blur-0"
        >
          Featured Collection
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 md:grid-cols-4 md:gap-8">
          {ITEMS.map((item) => (
            <NextLink
              key={item.name}
              data-collection="item"
              href={item.href}
              className="group block translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
            >
              <div className="mb-4 aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(17,17,17,0.04)] transition-shadow duration-300 group-hover:shadow-[0_16px_36px_rgba(17,17,17,0.08)] group-focus-visible:shadow-[0_16px_36px_rgba(17,17,17,0.08)]">
                <ParallaxImage
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-focus-visible:scale-105"
                />
              </div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-ink-button transition-colors group-hover:text-terracotta">
                <span className="relative">
                  {item.name}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-terracotta transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </span>
                <span aria-hidden className="arrow-nudge text-sm opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                  →
                </span>
              </h3>
              <p className="mt-1 text-sm text-text-muted transition-colors group-hover:text-text-secondary">
                {item.meta}
              </p>
            </NextLink>
          ))}
        </div>
      </article>
    </EditorialCard>
  );
}
