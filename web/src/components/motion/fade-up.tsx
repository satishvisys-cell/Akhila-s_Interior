"use client";

import { useRef, type ReactNode } from "react";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";
import { cn } from "@/lib/cn";

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Scroll-triggered fade-up — Stitch v2 motion language, GSAP-powered.
 *
 * Same public API as before (children/className/delay) so every existing
 * call site across the site (~40+) benefits from GSAP's ScrollTrigger
 * without any changes elsewhere — this is the "basic reveal" primitive.
 * For multi-step/scroll-scrubbed choreography see `PinnedStatement` and
 * `MagneticButton`, which use full GSAP timelines.
 *
 * Respects prefers-reduced-motion (skips the tween entirely) and the
 * default className hides the element via Tailwind so there is no flash
 * of unstyled content before GSAP's effect runs.
 */
export function FadeUp({ children, className, delay = 0 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: gsapMotion.duration.slow,
        delay: delay / 1000,
        ease: gsapMotion.ease.standard,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true, // mirrors the previous IntersectionObserver's unobserve-after-reveal behavior
        },
      });
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <div
      ref={ref}
      className={cn(
        "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
