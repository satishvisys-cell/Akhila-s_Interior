"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { cn } from "@/lib/cn";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

export interface FloorPlanHotspot {
  id: string;
  name: string;
  areaSqm: number;
  xPct: number;
  yPct: number;
  description: string;
  image: string;
}

export const HOUSE_HOTSPOTS: FloorPlanHotspot[] = [
  {
    id: "entrance",
    name: "Entrance Vestibule",
    areaSqm: 24,
    xPct: 20,
    yPct: 50,
    description: "Double-height travertine foyer with recessed slit illumination.",
    image: STITCH_V2.tour.entrance,
  },
  {
    id: "living",
    name: "Living Pavilion",
    areaSqm: 140,
    xPct: 55,
    yPct: 40,
    description: "Glazed pavilion opening onto ocean deck.",
    image: STITCH_V2.tour.living,
  },
  {
    id: "kitchen",
    name: "Culinary Atelier",
    areaSqm: 48,
    xPct: 80,
    yPct: 35,
    description: "Monolithic titanium counter island with walnut cabinetry.",
    image: STITCH_V2.tour.kitchen,
  },
  {
    id: "hall",
    name: "Gallery Promenade",
    areaSqm: 32,
    xPct: 40,
    yPct: 75,
    description: "Skylit gallery for artwork display.",
    image: STITCH_V2.tour.hall,
  },
  {
    id: "bedroom",
    name: "Master Suite",
    areaSqm: 85,
    xPct: 35,
    yPct: 20,
    description: "Acoustically isolated suite with private terrace.",
    image: STITCH_V2.tour.bedroom,
  },
  {
    id: "bathroom",
    name: "Primary Spa Bath",
    areaSqm: 36,
    xPct: 75,
    yPct: 75,
    description: "Bookmatched Nero Marquina marble with carved stone tub.",
    image: STITCH_V2.tour.bathroom,
  },
];

export function InteractiveFloorPlan({ projectSlug = "casa-horizon" }: { projectSlug?: string }) {
  const [activeHotspotId, setActiveHotspotId] = useState<string>("living");

  const activeHotspot =
    HOUSE_HOTSPOTS.find((h) => h.id === activeHotspotId) || HOUSE_HOTSPOTS[0];

  return (
    <section className="bg-ink py-32 text-text-inverse border-b border-white/10">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              TECHNICAL SCHEMATIC
            </span>
            <h2 className="mt-2 font-display text-4xl font-light leading-tight text-text-inverse md:text-6xl">
              Interactive Floor Plan <em className="text-accent">Schematic</em>
            </h2>
          </div>
          <div className="font-mono text-xs uppercase tracking-widest text-text-inverse/70">
            SCALE 1:100 METRIC • SCALE ACCURATE
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
          {/* Vector Schematic Area */}
          <div className="relative aspect-[16/10] w-full rounded border border-white/10 bg-ink p-6 lg:col-span-8 overflow-hidden">
            {/* Fine Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" />

            <svg className="h-full w-full stroke-white/20 fill-none" viewBox="0 0 800 500">
              <rect x="50" y="50" width="700" height="400" strokeWidth="3" stroke="#9A7B5A" />
              <line x1="280" y1="50" x2="280" y2="450" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="520" y1="50" x2="520" y2="450" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="50" y1="250" x2="750" y2="250" strokeWidth="1.5" stroke="#333740" />
            </svg>

            {/* Hotspots */}
            {HOUSE_HOTSPOTS.map((h) => {
              const isSelected = h.id === activeHotspot.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setActiveHotspotId(h.id)}
                  style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md transition-all duration-300",
                    isSelected
                      ? "border-accent bg-accent text-text-inverse font-bold scale-110 shadow-lg z-20"
                      : "border-white/20 bg-black/60 text-text-inverse/70 hover:border-accent hover:text-text-inverse z-10",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", isSelected ? "bg-ivory" : "bg-accent")} />
                  <span className="font-mono text-xs uppercase tracking-wider">{h.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Hotspot Metadata Panel */}
          <div className="flex flex-col justify-between space-y-6 rounded border border-white/10 bg-white/5 p-8 backdrop-blur-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-accent">
                  HOTSPOT SPECIFICATION
                </span>
                <span className="font-mono text-xs font-bold text-text-inverse">
                  {activeHotspot.areaSqm} M²
                </span>
              </div>

              <h3 className="mt-4 font-display text-3xl font-light text-text-inverse">
                {activeHotspot.name}
              </h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-text-inverse/80">
                {activeHotspot.description}
              </p>
            </div>

            <div className="aspect-[4/3] overflow-hidden rounded border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeHotspot.image}
                alt={activeHotspot.name}
                className="h-full w-full object-cover"
              />
            </div>

            <NextLink
              href={`/projects/${projectSlug}`}
              className="inline-flex items-center justify-center rounded bg-accent py-4 font-sans text-xs font-bold uppercase tracking-widest text-text-inverse transition-colors hover:bg-accent-hover"
            >
              Explore Full Project Specs →
            </NextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
