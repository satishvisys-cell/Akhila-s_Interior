"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  gsap,
  useGSAP,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";
import { cn } from "@/lib/cn";

/** Thin top progress bar — shows reading position without clutter. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const bar = barRef.current;
      if (!bar || prefersReducedMotion()) return;

      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });
      const onScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        gsap.to(bar, { scaleX: p, duration: 0.18, ease: "power1.out", overwrite: true });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: barRef },
  );

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[calc(var(--z-header)+1)] h-[2px] bg-transparent"
      aria-hidden
    >
      <div ref={barRef} className="h-full origin-left bg-terracotta" />
    </div>
  );
}

/** Appears after scrolling — one-click return to top. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        })
      }
      className={cn(
        "fixed bottom-6 right-5 z-[var(--z-header)] inline-flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-ink-button shadow-[0_10px_30px_rgba(17,17,17,0.12)] transition-all duration-300 md:bottom-8 md:right-8",
        "hover:-translate-y-0.5 hover:bg-ink-button hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span aria-hidden className="text-sm font-semibold">
        ↑
      </span>
    </button>
  );
}

/** Soft route enter — keeps navigation feeling continuous. */
export function PageEnter({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        el,
        { autoAlpha: 0.4, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        },
      );
    },
    { dependencies: [pathname], scope: ref },
  );

  return (
    <div ref={ref} className="min-h-0">
      {children}
    </div>
  );
}
