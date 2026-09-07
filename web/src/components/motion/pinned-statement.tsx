"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

const LINES = [
  "We shape raw materials into cinematic",
  "interiors that endure.",
  "Uncompromising precision. Transparent processes.",
] as const;

/**
 * Pinned, scroll-scrubbed statement reveal — the deep GSAP demo.
 *
 * Techniques combined here:
 * - `gsap.timeline()` with `stagger` for word-by-word sequencing (gsap-timeline)
 * - ScrollTrigger `pin: true` + `scrub: 1` on the TOP-LEVEL timeline only,
 *   tying playhead progress 1:1 to scroll position (gsap-scrolltrigger)
 * - Only `opacity`/`y`/`filter: blur()` are animated — transform/opacity-first,
 *   no layout properties (gsap-performance)
 * - `useGSAP({ scope })` for automatic ScrollTrigger cleanup on unmount/route
 *   change (gsap-react) — querying children by class within the scoped
 *   container ref, per the "container ref + query children" pattern for
 *   multiple targets.
 *
 * prefers-reduced-motion: no pin, no scrub, no camera-like movement — text
 * is simply visible immediately (a11y requirement).
 */
export function PinnedStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      const words = section.querySelectorAll<HTMLElement>("[data-word]");
      if (words.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.set(words, { opacity: 0.12, y: 18, filter: "blur(6px)" });

      gsap.timeline({
        defaults: { ease: gsapMotion.ease.cinematic },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1,
        },
      }).to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.045,
        duration: 1,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-ink px-8 text-text-inverse"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-10 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Interior Statement
        </p>
        <p className="font-display text-3xl font-light leading-[1.3] md:text-5xl lg:text-6xl">
          {LINES.map((line, lineIdx) => (
            <span key={line} className="block">
              {line.split(" ").map((word, wordIdx) => (
                <span
                  key={`${lineIdx}-${wordIdx}-${word}`}
                  data-word
                  className="mr-[0.28em] inline-block will-change-transform"
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
