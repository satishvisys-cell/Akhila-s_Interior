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
 * Scroll-triggered reveal — Dribbble blur + rise language.
 * Kept as FadeUp for call-site compatibility across the site.
 */
export function FadeUp({ children, className, delay = 0 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y: 26, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: gsapMotion.duration.base,
          delay: delay / 1000,
          ease: gsapMotion.ease.enter,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [delay] },
  );

  return (
    <div
      ref={ref}
      className={cn(
        "translate-y-10 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
