"use client";

import { useRef, useState } from "react";
import { EDITORIAL } from "@/lib/editorial";
import { EditorialCard } from "@/components/sections/editorial-card";
import { cn } from "@/lib/cn";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

const ROOMS = [
  {
    id: "01",
    title: "Living",
    count: "42 Spaces",
    body: "Comfort-focused volumes with sculptural seating, quiet materials, and daylight that moves through the day.",
    images: [EDITORIAL.rooms.living, EDITORIAL.intro[0]],
  },
  {
    id: "02",
    title: "Dining",
    count: "28 Spaces",
    body: "Gathering rooms composed for conversation — long tables, calibrated light, and honest surfaces.",
    images: [EDITORIAL.rooms.dining, EDITORIAL.intro[2]],
  },
  {
    id: "03",
    title: "Sleeping",
    count: "36 Spaces",
    body: "Restful suites with low palettes, tactile textiles, and thresholds that slow the evening down.",
    images: [EDITORIAL.intro[1], EDITORIAL.rooms.sleep],
  },
  {
    id: "04",
    title: "Kitchen",
    count: "19 Spaces",
    body: "Culinary cores with monolithic islands, concealed storage, and a clear line to landscape.",
    images: [EDITORIAL.rooms.kitchen, EDITORIAL.services[2]],
  },
  {
    id: "05",
    title: "Lighting",
    count: "35 Studies",
    body: "Carefully curated lighting designed to create the right atmosphere — warm, considered, and precise.",
    images: [EDITORIAL.rooms.light, EDITORIAL.collection[3]],
  },
] as const;

export function RoomAccordion() {
  const [open, setOpen] = useState("03");
  const rootRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const rows = root.querySelectorAll("[data-room-row]");

      if (prefersReducedMotion()) {
        gsap.set(rows, { autoAlpha: 1, y: 0, filter: "none" });
        return;
      }

      gsap.fromTo(
        rows,
        { y: 28, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.08,
          ease: gsapMotion.ease.enter,
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        },
      );
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !open || prefersReducedMotion()) return;
      const panel = root.querySelector(`[data-room-panel="${open}"]`);
      if (!panel) return;
      const imgs = panel.querySelectorAll("img");
      gsap.fromTo(
        imgs,
        {
          clipPath: "inset(10% 0 0 0)",
          scale: 1.05,
          autoAlpha: 0.7,
          filter: "blur(5px)",
        },
        {
          clipPath: "inset(0% 0 0 0)",
          scale: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.08,
          ease: gsapMotion.ease.enter,
        },
      );
    },
    { scope: rootRef, dependencies: [open] },
  );

  return (
    <EditorialCard className="font-editorial" motion>
      <ul ref={rootRef}>
        {ROOMS.map((room) => {
          const expanded = open === room.id;
          return (
            <li
              key={room.id}
              data-room-row
              className="border-b border-border opacity-0 first:border-t motion-reduce:opacity-100"
            >
              <button
                type="button"
                className={cn(
                  "group grid w-full grid-cols-[auto_1fr_auto_auto] items-start gap-x-3 gap-y-2 py-5 text-left transition-colors duration-300 md:grid-cols-[4rem_11rem_1fr_auto_auto] md:gap-x-6 md:py-6",
                  expanded ? "text-ink-button" : "hover:bg-black/[0.015]",
                )}
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? "" : room.id)}
              >
                <span className="pt-1 text-sm tabular-nums text-text-muted">
                  {room.id}
                </span>
                <h3
                  className={cn(
                    "text-2xl font-extrabold tracking-tight transition-colors md:text-3xl",
                    expanded ? "text-ink-button" : "text-ink-button/80 group-hover:text-ink-button",
                  )}
                >
                  {room.title}
                </h3>
                <p
                  className={cn(
                    "hidden text-sm leading-relaxed text-text-secondary md:block",
                    expanded ? "max-w-xl" : "line-clamp-2 max-w-lg",
                  )}
                >
                  {room.body}
                </p>
                <span className="pt-1 text-sm text-text-muted md:pt-2">
                  {room.count}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "pt-1 text-sm text-text-muted transition-transform duration-300 md:pt-2",
                    expanded && "rotate-45 text-ink-button",
                  )}
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  "grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  expanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="min-h-0" data-room-panel={room.id}>
                  <p className="pb-4 text-sm leading-relaxed text-text-secondary md:hidden">
                    {room.body}
                  </p>
                  <div className="grid gap-3 pb-8 sm:gap-4 md:grid-cols-[0.7fr_1.3fr] md:pl-[4rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={room.images[0]}
                      alt=""
                      className="motion-image-zoom aspect-[3/4] w-full rounded-xl object-cover"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={room.images[1]}
                      alt=""
                      className="motion-image-zoom aspect-[16/10] w-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </EditorialCard>
  );
}
