import type { CSSProperties } from "react";

/**
 * Motion language — Stitch-aligned, GPU-friendly, reduced-motion aware.
 * Prefer transform/opacity. No bounce. Architectural pace.
 */

export const motion = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  duration: {
    instant: 120,
    fast: 200,
    base: 400,
    slow: 700,
    reveal: 900,
    cinematic: 1200,
  },
  stagger: 70,
} as const;

export const motionClass = {
  fadeUp: "motion-fade-up",
  fadeIn: "motion-fade-in",
  reveal: "motion-reveal",
  imageZoom: "motion-image-zoom",
  reduced: "motion-reduce:transition-none motion-reduce:animate-none",
} as const;

/** Inline style helper for staggered reveals */
export function motionStyle(
  kind: "fadeUp" | "fadeIn" = "fadeUp",
  delayMs = 0,
): CSSProperties {
  return {
    ["--motion-delay" as string]: `${delayMs}ms`,
    animationName: kind === "fadeUp" ? "akhila-fade-up" : "akhila-fade-in",
    animationDuration: `${motion.duration.reveal}ms`,
    animationTimingFunction: motion.ease,
    animationFillMode: "both",
    animationDelay: `${delayMs}ms`,
  };
}
