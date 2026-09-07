"use client";

import { useRef, useState } from "react";
import { EDITORIAL } from "@/lib/editorial";
import { ParallaxImage } from "@/components/motion/parallax-image";
import {
  gsap,
  useGSAP,
  gsapMotion,
  prefersReducedMotion,
} from "@/lib/motion/gsap-client";

export function InspiredBanner() {
  const [email, setEmail] = useState("");
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const bits = root.querySelectorAll("[data-inspired]");

      if (prefersReducedMotion()) {
        gsap.set(bits, { autoAlpha: 1, y: 0, filter: "none" });
        return;
      }

      gsap.fromTo(
        bits,
        { y: 28, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.1,
          ease: gsapMotion.ease.enter,
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden rounded-[var(--radius-card)] font-editorial"
    >
      <ParallaxImage
        src={EDITORIAL.cta}
        alt=""
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-black/45" aria-hidden />
      <div className="relative z-10 px-5 py-16 text-center text-white sm:px-6 md:px-12 md:py-28">
        <h2
          data-inspired
          className="text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-7xl motion-reduce:opacity-100"
        >
          Inspired
        </h2>
        <p
          data-inspired
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 opacity-0 md:text-base motion-reduce:opacity-100"
        >
          Insights, trends, and design inspiration to help you create stylish,
          functional, and timeless living spaces.
        </p>
        <form
          data-inspired
          className="mx-auto mt-8 flex w-full max-w-md items-center gap-1 rounded-full border border-transparent bg-white p-1.5 text-ink-button opacity-0 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-[box-shadow,border-color] duration-300 focus-within:border-terracotta/40 focus-within:shadow-[0_16px_44px_rgba(0,0,0,0.22)] motion-reduce:opacity-100"
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = `/contact?email=${encodeURIComponent(email)}`;
          }}
        >
          <span className="hidden pl-4 text-text-muted sm:inline" aria-hidden>
            ✉
          </span>
          <label className="sr-only" htmlFor="inspired-email">
            Email
          </label>
          <input
            id="inspired-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter Your Email"
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none ring-0 placeholder:text-text-muted focus-visible:outline-none"
          />
          <button
            type="submit"
            className="btn-press inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-ink-button text-white transition-colors hover:bg-black"
            aria-label="Send"
          >
            ➤
          </button>
        </form>
      </div>
    </section>
  );
}
