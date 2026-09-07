"use client";

/**
 * Centralized GSAP client — single registration point.
 *
 * Why this file exists:
 * - GSAP + its plugins must be registered exactly once (HMR-safe) and only
 *   on the client — never during SSR (Next.js App Router renders on server).
 * - Every component that needs GSAP imports `gsap` / `ScrollTrigger` / `useGSAP`
 *   from here instead of importing "gsap" directly, so registration order and
 *   reduced-motion policy stay consistent app-wide.
 *
 * Skills followed: gsap-react (useGSAP, SSR safety), gsap-scrolltrigger
 * (registerPlugin once), gsap-performance (transform/opacity-first).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  // Registering twice (HMR) is safe — GSAP no-ops repeat registrations —
  // but we still guard so we don't do it during SSR at all.
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** True when the user has requested reduced motion at the OS/browser level. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Akhila cinematic motion tokens for GSAP tweens/timelines.
 * Mirrors `src/lib/motion/presets.ts` (CSS tokens) so both systems agree.
 */
export const gsapMotion = {
  ease: {
    standard: "power3.out",
    enter: "power2.out",
    exit: "power2.in",
    cinematic: "power4.inOut",
  },
  duration: {
    fast: 0.4,
    base: 0.8,
    slow: 1.1,
    cinematic: 1.6,
  },
  stagger: 0.08,
} as const;

export { gsap, ScrollTrigger, useGSAP };
