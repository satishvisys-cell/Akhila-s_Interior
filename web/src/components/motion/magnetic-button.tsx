"use client";

import { useRef, type ReactNode } from "react";
import NextLink from "next/link";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion/gsap-client";
import { cn } from "@/lib/cn";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Magnetic CTA — cursor-follow micro-interaction.
 *
 * GSAP technique demonstrated: `gsap.quickTo()` (gsap-performance skill) —
 * reuses a single tween per axis instead of creating a new tween on every
 * mousemove event, which is the correct pattern for high-frequency updates.
 * Event handlers are wrapped in `contextSafe` (gsap-react skill) so they
 * become no-ops after unmount and get removed deterministically in cleanup.
 *
 * Disabled entirely for touch devices and prefers-reduced-motion — this is
 * a decorative flourish, not a state carrier, so it degrades to a normal
 * link with zero behavior loss.
 */
export function MagneticButton({
  href,
  children,
  className,
  strength = 0.35,
}: MagneticButtonProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = rootRef.current;
      if (!el || !contextSafe) return;
      if (prefersReducedMotion()) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const onMove = contextSafe((e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      });

      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <NextLink ref={rootRef} href={href} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </NextLink>
  );
}
