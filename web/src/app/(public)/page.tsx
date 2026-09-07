import type { Metadata } from "next";
import NextLink from "next/link";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { FadeUp } from "@/components/motion/fade-up";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { PinnedStatement } from "@/components/motion/pinned-statement";
import { VideoPlayer } from "@/components/media/video-player";
import { BeforeAfterVideo } from "@/components/media/before-after-video";
import { MasterArchitecturalFilm } from "@/components/architecture/master-architectural-film";
import { RoomStateMatrix } from "@/components/architecture/room-state-matrix";
import { InteractiveFloorPlan } from "@/components/architecture/interactive-floor-plan";
import { SelectedWorksTeaser } from "@/components/sections/selected-works-teaser";
import { ExpertiseList } from "@/components/sections/expertise-list";
import { ARCHITECTURAL_VIDEOS } from "@/lib/media/media-asset";

export const metadata: Metadata = {
  title: "Akhila — Video-First Architecture & Construction Atelier",
  description:
    "Uncompromising precision and transparent telemetry. We shape raw materials into cinematic architectural realities through AI video transformations and turnkey construction.",
};

const METRICS = [
  ["120+", "Projects Delivered"],
  ["18+", "Years Experience"],
  ["42", "Cities"],
  ["98%", "Client Satisfaction"],
] as const;

const MATERIALS = [
  { name: "Honed Travertine", origin: "Tivoli Quarries, Italy", usage: "Entrance & Floor Slabs" },
  { name: "Fumed European Oak", origin: "Black Forest, Germany", usage: "Acoustic Wall Panels" },
  { name: "Board-Formed Concrete", origin: "Cast On-Site (60MPa UHPC)", usage: "Structural Shear Walls" },
  { name: "Low-Iron Structural Glass", origin: "Saint-Gobain, France", usage: "Perimeter Facade Sliders" },
  { name: "Anodized Titanium", origin: "Kobe Steel, Japan", usage: "Monolithic Kitchen Island" },
  { name: "Venetian Mineral Plaster", origin: "Novacolor, Italy", usage: "Interior Feature Walls" },
] as const;

export default function HomePage() {
  return (
    <>
      {/* 01 — Full-Screen Cinematic Video Hero */}
      <section className="relative flex h-[100svh] w-full items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0" aria-hidden>
          <div className="absolute inset-0 z-10 bg-ink/60 mix-blend-multiply" />
          <VideoPlayer
            asset={ARCHITECTURAL_VIDEOS.heroSequence}
            autoPlay
            loop
            muted
            showControls={false}
            className="h-full w-full rounded-none"
          />
        </div>

        <div className="relative z-20 mx-auto w-full max-w-7xl px-8">
          <FadeUp className="max-w-4xl">
            <p className="mb-6 flex items-center gap-4 font-sans text-xs font-semibold uppercase tracking-[0.3em] text-text-inverse md:text-sm">
              <span className="h-px w-12 bg-ivory/50" aria-hidden />
              ARCHITECTURE • INTERIORS • CONSTRUCTION • TELEMETRY
            </p>
            <h1 className="mb-8 font-display text-5xl font-light leading-[1.05] tracking-tight text-text-inverse md:text-7xl lg:text-8xl">
              Spaces Designed to
              <br />
              <em className="text-text-inverse/90">Become Experiences</em>
            </h1>
            <p className="mb-12 max-w-xl font-sans text-lg font-light leading-relaxed text-text-inverse/80 md:text-xl">
              Uncompromising precision and transparent telemetry. We shape raw
              materials into cinematic architectural realities that endure.
            </p>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <MagneticButton
                href="/projects"
                className="items-center justify-center rounded bg-accent px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest text-text-inverse transition-colors duration-300 hover:bg-accent-hover"
              >
                Explore Selected Works
              </MagneticButton>
              <NextLink
                href="/contact"
                className="group inline-flex items-center font-sans text-xs font-bold uppercase tracking-widest text-text-inverse transition-colors hover:text-accent"
              >
                Start Your Project
                <span
                  className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </NextLink>
            </div>
          </FadeUp>
        </div>

        {/* Minimal Corner Metadata */}
        <div className="absolute bottom-12 right-12 z-20 hidden md:block font-mono text-xs uppercase tracking-widest text-text-inverse/60">
          PROJECT 001 • MALIBU CA • 2026
        </div>
      </section>

      {/* 01.5 — Pinned Architectural Statement (GSAP scroll-scrub choreography) */}
      <PinnedStatement />

      {/* 02 — Trust Metrics */}
      <section className="relative z-10 border-b border-border bg-ivory py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4 md:gap-8 md:divide-x md:divide-border">
            {METRICS.map(([value, label], i) => (
              <FadeUp
                key={label}
                delay={i * 70}
                className="text-center md:px-8 md:text-left"
              >
                <h3 className="mb-2 font-display text-5xl font-light text-charcoal md:text-6xl">
                  {value}
                </h3>
                <p className="font-sans text-xs uppercase tracking-widest text-text-muted">
                  {label}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 02.5 — Selected Works (asymmetric editorial teaser, ported from the
          approved Stitch v2 "Cinematic Sequence" homepage variant) */}
      <SelectedWorksTeaser />

      {/* 02.6 — Our Core Disciplines (accordion, ported from the same variant) */}
      <ExpertiseList />

      {/* 03 — Studio Philosophy Manifesto */}
      <section className="border-b border-border bg-ivory py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
            <FadeUp className="lg:col-span-7">
              <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                STUDIO MANIFESTO
              </p>
              <h2 className="mb-8 font-display text-4xl font-light leading-tight tracking-tight text-charcoal md:text-6xl">
                Architecture as the Harmony of <em className="text-accent">Material & Light</em>
              </h2>
              <p className="mb-6 font-sans text-lg font-light leading-relaxed text-text-secondary">
                We believe architecture is not merely shelter, but a frame for living. Every line we draw, every slab of travertine we lay, and every glass pane we position is directed toward spatial clarity, natural daylight, and emotional permanence.
              </p>
              <p className="font-sans text-base font-light leading-relaxed text-text-secondary">
                From initial volumetric studies to live construction site telemetry, our studio operates with complete transparency. We honor raw materials—concrete, stone, timber, titanium—letting their authentic textures speak without artificial ornamentation.
              </p>
            </FadeUp>

            <FadeUp delay={100} className="lg:col-span-5 bg-surface-2 p-8 md:p-12 rounded border border-border">
              <span className="font-display text-7xl text-accent font-light leading-none block mb-4">“</span>
              <blockquote className="font-display text-2xl font-light italic leading-snug text-charcoal mb-6">
                Good design disappears into life. Outstanding architecture elevates every moment lived within it.
              </blockquote>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-charcoal">
                Akhila Architectural Atelier
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* 04 — Continuous 8-Stage Master Architectural Film Journey */}
      <MasterArchitecturalFilm />

      {/* 05 — AI-Generated Architectural Video Transformation (Before / After Slider) */}
      <section className="bg-ivory py-32 border-b border-border">
        <div className="mx-auto max-w-7xl px-8">
          <BeforeAfterVideo
            title="AI Architectural Transformation"
            subtitle="Drag the interactive slider to experience the raw structural site state vs completed luxury pavilion"
            before={{
              type: "image",
              src: STITCH_V2.home.atelier,
              label: "01 Raw Concrete Frame",
            }}
            after={{
              type: "video",
              src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
              poster: STITCH_V2.tour.living,
              label: "02 Finished Luxury Interior",
            }}
          />
        </div>
      </section>

      {/* 06 — 5-State Room Video Experience Matrix */}
      <RoomStateMatrix />

      {/* 07 — Interactive Technical Floor Plan Schematic */}
      <InteractiveFloorPlan projectSlug="casa-horizon" />

      {/* 08 — Tactile Material Curation */}
      <section className="bg-charcoal py-32 text-text-inverse border-b border-white/10">
        <div className="mx-auto max-w-7xl px-8">
          <FadeUp className="mb-16">
            <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
              TACTILE MATERIAL SPECS
            </p>
            <h2 className="font-display text-4xl font-light text-text-inverse md:text-6xl">
              Authentic Material Curation
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MATERIALS.map((m, i) => (
              <FadeUp key={m.name} delay={i * 60} className="rounded border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent">
                  {m.usage}
                </span>
                <h3 className="mt-2 font-display text-xl text-text-inverse">
                  {m.name}
                </h3>
                <p className="mt-1 font-sans text-xs text-text-inverse/60">
                  Origin: {m.origin}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — Live Sites CCTV Telemetry Teaser */}
      <section className="overflow-hidden border-b border-border bg-ivory py-16">
        <FadeUp className="mx-auto flex max-w-7xl items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center rounded bg-live/10 px-3 py-1 font-sans text-xs font-bold uppercase tracking-widest text-live">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-live" aria-hidden />
              Live Site Telemetry
            </span>
            <h3 className="font-display text-2xl font-light text-charcoal">
              Real-Time Construction Site Telemetry & CCTV Portal
            </h3>
          </div>
          <NextLink
            href="/live-sites"
            className="group flex items-center font-sans text-xs font-bold uppercase tracking-widest text-accent transition-opacity hover:opacity-80"
          >
            Access Live Site Portal <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </NextLink>
        </FadeUp>
      </section>

      {/* 10 — Project Consultation CTA */}
      <section className="bg-charcoal py-32 text-text-inverse">
        <div className="mx-auto max-w-4xl px-8 text-center">
          <FadeUp>
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-accent">
              COMMISSION AN ARCHITECTURAL VISION
            </p>
            <h2 className="mb-8 font-display text-5xl font-light leading-tight md:text-7xl">
              Ready to Realize Your Space?
            </h2>
            <p className="mb-12 font-sans text-lg font-light leading-relaxed text-text-inverse/80">
              We are currently accepting select residential and commercial commissions. Discuss your project requirements, location, and timeline with our atelier team.
            </p>
            <NextLink
              href="/contact"
              className="inline-flex items-center justify-center rounded bg-accent px-10 py-5 font-sans text-xs font-bold uppercase tracking-widest text-text-inverse transition-colors hover:bg-accent-hover"
            >
              Start a Conversation →
            </NextLink>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
