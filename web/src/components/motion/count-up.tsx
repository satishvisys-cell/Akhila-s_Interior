"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

type CountUpProps = {
  end: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export function CountUp({
  end,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const format = (value: number) => `${prefix}${Math.round(value)}${suffix}`;

      if (prefersReducedMotion()) {
        el.textContent = format(end);
        return;
      }

      const state = { value: 0 };
      gsap.to(state, {
        value: end,
        duration: gsapMotion.duration.cinematic,
        ease: gsapMotion.ease.standard,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = format(state.value);
        },
      });
    },
    { scope: ref, dependencies: [end, prefix, suffix] },
  );

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}
