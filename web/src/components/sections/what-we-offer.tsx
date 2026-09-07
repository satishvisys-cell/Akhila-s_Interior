"use client";

import { useRef } from "react";
import NextLink from "next/link";
import { INTERIOR_SERVICES } from "@/lib/services";
import { EditorialCard } from "@/components/sections/editorial-card";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

const FEATURED = INTERIOR_SERVICES.slice(0, 3);
/** Dribbble accordion: ~50% / 25% / 25% → grow 2.4 : 1 : 1 */
const EXPANDED = 2.4;
const COLLAPSED = 1;
const DEFAULT_ACTIVE = 0;

export function WhatWeOffer() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = cardsRef.current;
      if (!root || prefersReducedMotion()) {
        if (root) {
          gsap.set(root.querySelectorAll("[data-offer-intro], [data-service-card]"), {
            autoAlpha: 1,
            y: 0,
            filter: "none",
          });
        }
        return;
      }
      const intro = root.querySelectorAll("[data-offer-intro]");
      const cards = root.querySelectorAll("[data-service-card]");
      gsap.fromTo(
        intro,
        { y: 40, autoAlpha: 0, filter: "blur(12px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.08,
          ease: gsapMotion.ease.standard,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        cards,
        { y: 56, autoAlpha: 0, filter: "blur(14px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.12,
          delay: 0.1,
          ease: gsapMotion.ease.standard,
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );
    },
    { scope: cardsRef },
  );

  useGSAP(
    (_context, contextSafe) => {
      const root = cardsRef.current;
      if (!root || !contextSafe) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]", root);
      const images = gsap.utils.toArray<HTMLElement>("[data-service-image]", root);
      const details = gsap.utils.toArray<HTMLElement>("[data-service-detail]", root);
      const arrows = gsap.utils.toArray<HTMLElement>("[data-service-arrow]", root);
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { flexGrow: 1 });
        gsap.set(details, { autoAlpha: 1, y: 0, height: "auto" });
        gsap.set(arrows, { autoAlpha: 0 });
        gsap.set(images, { scale: 1 });
      });

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          let active = DEFAULT_ACTIVE;

          const apply = (index: number, immediate = false) => {
            active = index;
            const duration = immediate ? 0 : 0.7;
            const ease = "power3.inOut";

            cards.forEach((card, i) => {
              const on = i === index;
              card.dataset.active = on ? "true" : "false";
              if (arrows[i]) {
                arrows[i].tabIndex = on ? -1 : 0;
                arrows[i].setAttribute("aria-hidden", on ? "true" : "false");
              }

              gsap.to(card, {
                flexGrow: on ? EXPANDED : COLLAPSED,
                duration,
                ease,
                overwrite: "auto",
              });

              if (immediate) {
                gsap.set(details[i], {
                  autoAlpha: on ? 1 : 0,
                  y: on ? 0 : 12,
                });
                gsap.set(arrows[i], {
                  autoAlpha: on ? 0 : 1,
                  scale: 1,
                });
                gsap.set(images[i], { scale: on ? 1.04 : 1 });
                return;
              }

              if (on) {
                gsap.to(arrows[i], {
                  autoAlpha: 0,
                  scale: 0.85,
                  duration: 0.15,
                  ease: gsapMotion.ease.exit,
                  overwrite: "auto",
                });
                gsap.to(details[i], {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.4,
                  delay: 0.12,
                  ease: gsapMotion.ease.standard,
                  overwrite: "auto",
                });
              } else {
                gsap.to(details[i], {
                  autoAlpha: 0,
                  y: 12,
                  duration: 0.15,
                  ease: gsapMotion.ease.exit,
                  overwrite: "auto",
                });
                gsap.to(arrows[i], {
                  autoAlpha: 1,
                  scale: 1,
                  duration: 0.3,
                  delay: 0.12,
                  ease: gsapMotion.ease.standard,
                  overwrite: "auto",
                });
              }

              gsap.to(images[i], {
                scale: on ? 1.04 : 1,
                duration: 0.85,
                ease: gsapMotion.ease.standard,
                overwrite: "auto",
              });
            });
          };

          gsap.set(cards, {
            flexGrow: COLLAPSED,
            flexShrink: 1,
            flexBasis: 0,
          });
          gsap.set(images, { scale: 1 });
          apply(DEFAULT_ACTIVE, true);

          const onEnter = contextSafe((event: Event) => {
            const target = event.currentTarget as HTMLElement;
            const index = cards.indexOf(target);
            if (index < 0 || index === active) return;
            apply(index);
          });

          const onLeave = contextSafe(() => {
            if (active === DEFAULT_ACTIVE) return;
            apply(DEFAULT_ACTIVE);
          });

          cards.forEach((card) => {
            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("focusin", onEnter);
          });
          root.addEventListener("mouseleave", onLeave);

          return () => {
            cards.forEach((card) => {
              card.removeEventListener("mouseenter", onEnter);
              card.removeEventListener("focusin", onEnter);
            });
            root.removeEventListener("mouseleave", onLeave);
          };
        },
      );

      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(details, { autoAlpha: 1, y: 0 });
          gsap.set(arrows, { autoAlpha: 0 });
        },
      );

      return () => mm.revert();
    },
    { scope: cardsRef },
  );

  return (
    <EditorialCard className="font-editorial" motion>
      <div ref={cardsRef}>
      <div className="mb-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:mb-10">
        <div data-offer-intro className="lg:col-span-7">
          <p className="text-sm text-text-muted">Services</p>
          <h2 className="mt-2 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-button md:text-5xl lg:text-[3.15rem]">
            Our interior services, tailored uniquely for you.
          </h2>
          <NextLink
            href="/services"
            className="btn-press mt-5 inline-flex size-11 items-center justify-center rounded-full border border-ink-button text-ink-button hover:bg-ink-button hover:text-white"
            aria-label="View all interior services"
          >
            ↓
          </NextLink>
        </div>
        <p
          data-offer-intro
          className="max-w-md text-sm leading-relaxed text-text-secondary md:text-base lg:col-span-5"
        >
          Time to refresh a ceiling, a wall, a window? We specify and install
          the finishes that complete a home — with one standard of craft.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:h-[min(34rem,68vh)] lg:flex-row lg:items-stretch lg:gap-3">
        {FEATURED.map((service, index) => (
          <article
            key={service.id}
            data-service-card
            data-active={index === DEFAULT_ACTIVE ? "true" : "false"}
            className="group flex min-h-0 min-w-0 flex-1 flex-col opacity-0 motion-reduce:opacity-100"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#f6f6f4] lg:aspect-auto lg:min-h-0 lg:flex-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-service-image
                src={service.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover will-change-transform"
              />
            </div>
            <div className="relative shrink-0 pt-4 lg:h-[9.75rem]">
              <h3 className="text-xl font-extrabold leading-tight tracking-tight text-ink-button md:text-2xl">
                {service.title}
              </h3>
              <div
                data-service-detail
                className="mt-2 max-lg:!translate-y-0 max-lg:!opacity-100 max-lg:!visible lg:pointer-events-none lg:invisible lg:translate-y-3 lg:opacity-0 [[data-active=true]_&]:lg:pointer-events-auto [[data-active=true]_&]:lg:visible [[data-active=true]_&]:lg:translate-y-0 [[data-active=true]_&]:lg:opacity-100"
              >
                <p className="line-clamp-2 max-w-md text-sm leading-relaxed text-text-secondary">
                  {service.body}
                </p>
                <NextLink
                  href={`/services#${service.id}`}
                  className="btn-press mt-3 inline-flex min-h-11 w-fit items-center rounded-full border border-ink-button px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink-button hover:bg-ink-button hover:text-white"
                >
                  View service
                </NextLink>
              </div>
              <NextLink
                data-service-arrow
                href={`/services#${service.id}`}
                className="btn-press absolute bottom-0 left-0 z-10 hidden size-11 items-center justify-center rounded-full border border-ink-button text-ink-button hover:bg-ink-button hover:text-white max-lg:!hidden lg:inline-flex lg:pointer-events-auto lg:visible lg:opacity-100 [[data-active=true]_&]:lg:pointer-events-none [[data-active=true]_&]:lg:invisible [[data-active=true]_&]:lg:opacity-0"
                aria-label={`View ${service.title}`}
                tabIndex={index === DEFAULT_ACTIVE ? -1 : 0}
              >
                →
              </NextLink>
            </div>
          </article>
        ))}
      </div>
      </div>
    </EditorialCard>
  );
}
