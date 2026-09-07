"use client";

/**
 * Dribbble reference scroll language:
 * blur + translate + opacity, staggered children, image clip/scale reveals.
 * Prefer transform/opacity/filter — GPU-friendly, reduced-motion aware.
 */
import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
  ScrollTrigger,
} from "@/lib/motion/gsap-client";

export type RevealVariant = "up" | "left" | "right" | "scale" | "image" | "card";

const FROM: Record<
  RevealVariant,
  gsap.TweenVars
> = {
  /* Snappier + lighter blur = friendlier (less “wait for the page”) */
  up: { y: 28, autoAlpha: 0, filter: "blur(6px)" },
  left: { x: -28, autoAlpha: 0, filter: "blur(6px)" },
  right: { x: 28, autoAlpha: 0, filter: "blur(6px)" },
  scale: { scale: 0.96, autoAlpha: 0, filter: "blur(5px)" },
  image: {
    scale: 1.06,
    autoAlpha: 0.45,
    filter: "blur(8px)",
    clipPath: "inset(6% 5% 6% 5%)",
  },
  card: { y: 32, autoAlpha: 0, filter: "blur(7px)" },
};

const TO: gsap.TweenVars = {
  x: 0,
  y: 0,
  scale: 1,
  autoAlpha: 1,
  filter: "blur(0px)",
  clipPath: "inset(0% 0% 0% 0%)",
  duration: 0.7,
  ease: gsapMotion.ease.enter,
};

function revealTween(
  targets: gsap.TweenTarget,
  variant: RevealVariant,
  extras: gsap.TweenVars = {},
) {
  return gsap.fromTo(targets, { ...FROM[variant] }, { ...TO, ...extras });
}

/** Single element scroll reveal — matches Dribbble entrance. */
export function Reveal({
  children,
  className,
  variant = "up",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  as?: "div" | "section" | "article" | "header" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { clearProps: "all" });
        return;
      }
      revealTween(el, variant, {
        delay: delay / 1000,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref, dependencies: [variant, delay] },
  );

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "opacity-0 motion-reduce:opacity-100 motion-reduce:transform-none",
        className,
      )}
      data-reveal={variant}
    >
      {children}
    </Tag>
  );
}

/** Stagger children when the group enters the viewport. */
export function RevealGroup({
  children,
  className,
  variant = "up",
  stagger = 0.1,
  childSelector = "[data-reveal-item]",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  stagger?: number;
  childSelector?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = root.querySelectorAll(childSelector);
      if (items.length === 0) return;

      if (prefersReducedMotion()) {
        gsap.set(items, { clearProps: "all" });
        return;
      }

      gsap.set(items, FROM[variant]);
      revealTween(items, variant, {
        stagger,
        scrollTrigger: { trigger: root, start: "top 82%", once: true },
      });
    },
    { scope: ref, dependencies: [variant, stagger, childSelector] },
  );

  return (
    <div ref={ref} className={className} data-reveal-stagger={variant}>
      {children}
    </div>
  );
}

/** Image clip + blur + scale reveal (Dribbble media entrance). */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal className={cn("overflow-hidden", className)} variant="image" delay={delay}>
      {children}
    </Reveal>
  );
}

/**
 * Sitewide boot — animates editorial cards and any leftover
 * [data-reveal] / [data-reveal-image] markers on public pages.
 */
export function DribbbleScrollBoot() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const ctx = gsap.context(() => {
        // Soft card lift for sections that opt in
        ScrollTrigger.batch("[data-motion-card]", {
          start: "top 92%",
          once: true,
          interval: 0.12,
          batchMax: 4,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 36, autoAlpha: 0, filter: "blur(8px)" },
              {
                y: 0,
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 0.75,
                stagger: 0.08,
                ease: gsapMotion.ease.enter,
                overwrite: "auto",
              },
            );
          },
        });

        // Generic markers (for pages that only set attributes)
        ScrollTrigger.batch('[data-reveal]:not([data-reveal-bound])', {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            batch.forEach((el) => {
              if (!(el instanceof HTMLElement)) return;
              if (el.dataset.revealBound === "1") return;
              // Skip elements already driven by Reveal/RevealGroup hooks
              if (el.closest("[data-reveal-stagger]")) return;
              el.dataset.revealBound = "1";
              const variant = (el.dataset.reveal as RevealVariant) || "up";
              revealTween(el, variant, { overwrite: "auto" });
            });
          },
        });

        ScrollTrigger.batch("[data-reveal-image]", {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              {
                scale: 1.06,
                autoAlpha: 0.45,
                filter: "blur(8px)",
                clipPath: "inset(6% 5% 6% 5%)",
              },
              {
                scale: 1,
                autoAlpha: 1,
                filter: "blur(0px)",
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.8,
                stagger: 0.06,
                ease: gsapMotion.ease.enter,
                overwrite: "auto",
              },
            );
          },
        });

        ScrollTrigger.refresh();
      }, document.body);

      return () => ctx.revert();
    },
    { dependencies: [pathname], scope: rootRef },
  );

  return <div ref={rootRef} className="contents" aria-hidden />;
}
