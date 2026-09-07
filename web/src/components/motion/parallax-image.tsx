"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import {
  gsap,
  useGSAP,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const img = root?.querySelector("img");
      if (!root || !img) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(img, { yPercent: 0, scale: 1 });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          img,
          { yPercent: -10, scale: 1.08 },
          {
            yPercent: 10,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover will-change-transform",
          imgClassName,
        )}
      />
    </div>
  );
}
