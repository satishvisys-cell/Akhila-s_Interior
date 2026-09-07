"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

export interface StageFilmItem {
  number: string;
  slug: string;
  name: string;
  subtitle: string;
  durationSec: number;
  image: string;
  videoSrc?: string;
  description: string;
  materials: string[];
}

export const ARCHITECTURAL_JOURNEY_STAGES: StageFilmItem[] = [
  {
    number: "01",
    slug: "front-exterior",
    name: "Front Exterior",
    subtitle: "Cantilevered Travertine Threshold",
    durationSec: 6,
    image: STITCH_V2.home.hero,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "A monolithic veil of board-formed concrete and honed travertine framing coastal daylight.",
    materials: ["Tivoli Travertine", "Board-Formed UHPC", "Low-Iron Facade Sliders"],
  },
  {
    number: "02",
    slug: "entrance",
    name: "Entrance Vestibule",
    subtitle: "Double-Height Travertine Foyer",
    durationSec: 6,
    image: STITCH_V2.tour.entrance,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Double-height vestibule with concealed LED illumination slits and shadow gap joinery.",
    materials: ["Venetian Plaster", "Brushed Bronze Door Pivots"],
  },
  {
    number: "03",
    slug: "hall",
    name: "Gallery Promenade",
    subtitle: "Skylit Gallery Corridor",
    durationSec: 6,
    image: STITCH_V2.tour.hall,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "A measured promenade for art, light, and quiet transition between living zones.",
    materials: ["Fumed European Oak", "Recessed Wall Lighting"],
  },
  {
    number: "04",
    slug: "living-room",
    name: "Glazed Living Pavilion",
    subtitle: "Floating Seating Pavilion",
    durationSec: 7,
    image: STITCH_V2.tour.living,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4",
    description: "Expansive structural glass sliders blurring the boundary between interior sanctuary and sea.",
    materials: ["Acoustic Timber Battens", "Saint-Gobain Glass"],
  },
  {
    number: "05",
    slug: "kitchen",
    name: "Culinary Atelier",
    subtitle: "Monolithic Titanium Island",
    durationSec: 7,
    image: STITCH_V2.tour.kitchen,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "Dark fumed oak cabinetry contrasting with a single-slab titanium counter island.",
    materials: ["Anodized Titanium", "Smoked Oak Millwork"],
  },
  {
    number: "06",
    slug: "stairs",
    name: "Cantilevered Stairs",
    subtitle: "Floating Structural Treads",
    durationSec: 6,
    image: STITCH_V2.tour.stairs,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "UHPC concrete stair treads cantilevered from structural shear wall with seamless glass rails.",
    materials: ["Structural UHPC", "Toughened Laminated Glass"],
  },
  {
    number: "07",
    slug: "master-bedroom",
    name: "Master Suite",
    subtitle: "Acoustic Horizon Sanctuary",
    durationSec: 7,
    image: STITCH_V2.tour.bedroom,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
    description: "A calm elevated sanctuary framed by continuous glass wall and integrated acoustic millwork.",
    materials: ["Fumed Oak Flooring", "Bespoke Textiles"],
  },
  {
    number: "08",
    slug: "bathroom",
    name: "Primary Bath & Spa",
    subtitle: "Nero Marquina Stone Sanctuary",
    durationSec: 6,
    image: STITCH_V2.tour.bathroom,
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "Bookmatched Nero Marquina marble walls around a solid carved stone tub overlooking garden courtyards.",
    materials: ["Nero Marquina Marble", "Brushed Gunmetal Fittings"],
  },
];

export function MasterArchitecturalFilm() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = ARCHITECTURAL_JOURNEY_STAGES[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % ARCHITECTURAL_JOURNEY_STAGES.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + ARCHITECTURAL_JOURNEY_STAGES.length) % ARCHITECTURAL_JOURNEY_STAGES.length,
    );
  };

  return (
    <section className="relative w-full overflow-hidden bg-ink py-32 text-text-inverse">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              CINEMATIC INTERIOR JOURNEY
            </span>
            <h2 className="mt-2 font-display text-4xl font-light leading-tight text-text-inverse md:text-6xl">
              Continuous 8-Stage <em className="text-accent">Walkthrough</em>
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-inverse/70">
            <span>STAGE {activeStage.number} / 08</span>
            <span>•</span>
            <span>TOTAL ~48S FILM</span>
          </div>
        </div>

        {/* Stage Timeline Navigation Pills */}
        <div className="mb-12 flex gap-3 overflow-x-auto pb-4 scrollbar-none">
          {ARCHITECTURAL_JOURNEY_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={stage.slug}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded border px-5 py-3 font-sans text-xs uppercase tracking-wider transition-all duration-300",
                  isActive
                    ? "border-accent bg-accent font-bold text-text-inverse shadow-lg"
                    : "border-white/10 bg-white/5 text-text-inverse/70 hover:border-white/30 hover:text-text-inverse",
                )}
              >
                <span className="font-mono text-[10px] opacity-80">{stage.number}</span>
                <span>{stage.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Stage Display Area */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Stage Video / Media Canvas */}
          <div className="relative aspect-[16/10] overflow-hidden rounded border border-white/10 bg-ink shadow-2xl lg:col-span-8">
            <video
              key={activeStage.videoSrc}
              src={activeStage.videoSrc}
              poster={activeStage.image}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 font-display text-2xl text-text-inverse">
              {activeStage.number} — {activeStage.subtitle}
            </div>

            {/* Previous / Next Arrow Controls */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-text-inverse transition-colors hover:bg-accent"
                aria-label="Previous Stage"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center rounded border border-white/20 bg-black/40 text-text-inverse transition-colors hover:bg-accent"
                aria-label="Next Stage"
              >
                →
              </button>
            </div>
          </div>

          {/* Stage Architectural Metadata */}
          <div className="flex flex-col justify-between space-y-8 rounded border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:col-span-4">
            <div>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                SPATIAL SPECIFICATION
              </span>
              <h3 className="mt-2 font-display text-3xl font-light text-text-inverse">
                {activeStage.name}
              </h3>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-text-inverse/80">
                {activeStage.description}
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-text-inverse">
                Material Curation
              </h4>
              <ul className="space-y-2 font-sans text-xs text-text-inverse/70">
                {activeStage.materials.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <NextLink
              href="/contact"
              className="inline-flex items-center justify-center rounded bg-accent py-4 font-sans text-xs font-bold uppercase tracking-widest text-text-inverse transition-colors hover:bg-accent-hover"
            >
              Commission Project Consultation →
            </NextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
