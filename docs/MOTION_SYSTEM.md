# Motion System — GSAP integration

## Where GSAP lives

`web/src/lib/motion/gsap-client.ts` — the **only** place `gsap` / `ScrollTrigger` /
`useGSAP` get registered. Every component imports from here, never from
`"gsap"` directly, so registration happens once, client-only, HMR-safe.

```ts
import { gsap, ScrollTrigger, useGSAP, gsapMotion, prefersReducedMotion } from "@/lib/motion/gsap-client";
```

## Components

| Component | GSAP technique | File |
|---|---|---|
| `FadeUp` | `useGSAP` + single-element `ScrollTrigger` (`once: true`) | `components/motion/fade-up.tsx` |
| `MagneticButton` | `gsap.quickTo()` + `contextSafe` event handlers | `components/motion/magnetic-button.tsx` |
| `PinnedStatement` | `gsap.timeline()` + `ScrollTrigger` `pin` + `scrub` + `stagger` | `components/motion/pinned-statement.tsx` |

`FadeUp` kept its original public API (`children`, `className`, `delay`) so
all ~40 existing call sites across the public routes upgraded to GSAP with
zero call-site changes — it previously used a hand-rolled
`IntersectionObserver`.

## Rules enforced (from the `gsap` skill + official GSAP skills)

- **Registration:** once, client-only, in `gsap-client.ts` — never during SSR.
- **Cleanup:** every animation uses `useGSAP({ scope })`; ScrollTriggers and
  tweens are auto-reverted on unmount/route change. No manual `ctx.revert()`
  needed because `@gsap/react` handles it.
- **Targets:** refs or a scoped `querySelectorAll` inside a ref'd container
  — never bare selector strings that could match elements outside the
  component.
- **Performance:** only `opacity`, `y`/`x` (transform), and `filter: blur()`
  are animated — no layout properties. High-frequency updates
  (`MagneticButton` mousemove) use `quickTo()` instead of creating a tween
  per event.
- **ScrollTrigger placement:** `scrollTrigger` is only ever set on the
  top-level tween/timeline, never on a child tween inside a timeline.
- **Reduced motion:** every component checks `prefersReducedMotion()` first
  and short-circuits to the final state with `gsap.set()` — no pin, no
  scrub, no camera-like movement, per the accessibility rule.
- **No scroll hijacking:** `PinnedStatement` pins for a bounded scroll
  distance (`end: "+=120%"`) and always resolves to normal document flow
  afterward.

## Live demo (verified in a real browser session)

1. `/` → scroll past the hero. The **Architectural Statement** section pins
   to the viewport (`position: fixed`, confirmed via `getBoundingClientRect`)
   and each word interpolates from `opacity: 0.12 / blur(6px) / y:18px` to
   `opacity: 1 / blur(0) / y:0` in lockstep with scroll position — verified
   mid-scroll at ~96% → ~15% opacity gradient across the first ten words.
   Continuing to scroll releases the pin and the page proceeds normally.
2. The **"Explore Selected Works"** hero CTA is a `MagneticButton` — it
   nudges toward the cursor on desktop pointer devices and is a no-op on
   touch/`prefers-reduced-motion`.
3. Every `FadeUp` section below (metrics, manifesto, materials, CTA) reveals
   via GSAP + `ScrollTrigger` — confirmed the `120+` metric goes from
   `opacity: 0` to `opacity: 1` once scrolled into view.

## Extending this system

- New scroll-choreographed sections: follow `PinnedStatement`'s pattern
  (top-level timeline, `scrollTrigger` on the timeline only, `useGSAP({ scope })`).
- New micro-interactions: follow `MagneticButton`'s pattern (`quickTo` +
  `contextSafe`, disabled for touch/reduced-motion).
- Simple reveals: just use `<FadeUp>` — do not hand-roll a new
  `IntersectionObserver` or a new GSAP tween for basic fade/slide-in.
