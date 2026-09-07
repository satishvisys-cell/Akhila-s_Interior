"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface FloorPlanRoomHotspot {
  id: string;
  name: string;
  slug: string;
  area: string;
  xPct: number;
  yPct: number;
  description: string;
}

export const GROUND_FLOOR_HOTSPOTS: FloorPlanRoomHotspot[] = [
  { id: "entrance", name: "Entrance Vestibule", slug: "entrance", area: "24 m²", xPct: 20, yPct: 50, description: "Double-height travertine foyer with recessed slit illumination." },
  { id: "living", name: "Living Pavilion", slug: "living", area: "140 m²", xPct: 55, yPct: 40, description: "Glazed pavilion opening onto garden infinity deck." },
  { id: "kitchen", name: "Culinary Atelier", slug: "kitchen", area: "48 m²", xPct: 80, yPct: 35, description: "Monolithic titanium counter island with walnut cabinetry." },
  { id: "hall", name: "Gallery Hallway", slug: "hall", area: "32 m²", xPct: 40, yPct: 75, description: "Skylit promenade with artwork niches." },
  { id: "staircase", name: "Cantilevered Stairs", slug: "staircase", area: "18 m²", xPct: 25, yPct: 75, description: "Floating UHPC concrete treads anchored to shear wall." },
];

export const FIRST_FLOOR_HOTSPOTS: FloorPlanRoomHotspot[] = [
  { id: "bedroom", name: "Master Suite", slug: "bedroom", area: "85 m²", xPct: 35, yPct: 45, description: "Acoustically isolated suite with private balcony." },
  { id: "bathroom", name: "En-Suite Spa", slug: "bathroom", area: "36 m²", xPct: 75, yPct: 45, description: "Bookmatched Nero Marquina marble with carved stone tub." },
  { id: "balcony", name: "Private Terrace", slug: "balcony", area: "42 m²", xPct: 35, yPct: 15, description: "Cantilevered teak deck framing panoramic sunset views." },
];

export function FloorPlanViewer({ projectSlug = "casa-horizon" }: { projectSlug?: string }) {
  const [activeLevel, setActiveLevel] = useState<"ground" | "first">("ground");
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>("living");

  const hotspots = activeLevel === "ground" ? GROUND_FLOOR_HOTSPOTS : FIRST_FLOOR_HOTSPOTS;
  const activeRoom = hotspots.find((h) => h.id === selectedHotspotId) || hotspots[0];

  return (
    <div className="relative w-full bg-neutral-950 p-6 md:p-10 border border-neutral-800 text-neutral-100">
      {/* Header Level Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">
            INTERIOR SCHEMATIC
          </span>
          <h2 className="mt-1 font-display text-3xl font-light text-neutral-100">
            Interactive Floor Plan
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-neutral-900 p-1 border border-neutral-800 rounded-full">
          <button
            onClick={() => {
              setActiveLevel("ground");
              setSelectedHotspotId("living");
            }}
            className={`px-5 py-2 font-mono text-xs font-bold rounded-full transition-all uppercase ${
              activeLevel === "ground"
                ? "bg-amber-400 text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            GROUND FLOOR
          </button>
          <button
            onClick={() => {
              setActiveLevel("first");
              setSelectedHotspotId("bedroom");
            }}
            className={`px-5 py-2 font-mono text-xs font-bold rounded-full transition-all uppercase ${
              activeLevel === "first"
                ? "bg-amber-400 text-neutral-950 shadow-md"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            FIRST FLOOR
          </button>
        </div>
      </div>

      {/* Main Floor Plan Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* SVG Floor Plan Canvas */}
        <div className="relative lg:col-span-2 aspect-[16/10] w-full bg-neutral-900/60 border border-neutral-800 p-6 rounded-sm flex items-center justify-center overflow-hidden">
          {/* Fine Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" />

          {/* SVG Floor Plan Blueprint Vectors */}
          <svg className="h-full w-full stroke-neutral-700 fill-none" viewBox="0 0 800 500">
            {/* Outer Walls */}
            <rect x="50" y="50" width="700" height="400" strokeWidth="4" stroke="#4a4e58" />
            <line x1="280" y1="50" x2="280" y2="450" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="520" y1="50" x2="520" y2="450" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="50" y1="250" x2="750" y2="250" strokeWidth="2" stroke="#333740" />

            {/* Scale Marker */}
            <text x="60" y="475" className="fill-neutral-500 font-mono text-[10px] uppercase">
              SCALE 1:100 (METRIC)
            </text>
          </svg>

          {/* Room Hotspot Markers */}
          {hotspots.map((h) => {
            const isSelected = h.id === activeRoom.id;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedHotspotId(h.id)}
                style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center space-x-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all ${
                  isSelected
                    ? "bg-amber-400 text-neutral-950 border-amber-300 font-bold scale-110 shadow-lg z-20"
                    : "bg-neutral-950/80 text-neutral-300 border-neutral-700 hover:border-amber-400 hover:text-amber-200 z-10"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-neutral-950" : "bg-amber-400"}`} />
                <span className="font-mono text-xs tracking-wider uppercase">{h.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Room Metadata Panel & Jump to 3D */}
        <div className="bg-neutral-900 p-6 border border-neutral-800 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">
                HOTSPOT DETAILS
              </span>
              <span className="font-mono text-xs text-neutral-400 font-bold">
                AREA: {activeRoom.area}
              </span>
            </div>

            <h3 className="mt-4 font-display text-2xl font-light text-neutral-100">
              {activeRoom.name}
            </h3>
            <p className="mt-2 text-sm text-neutral-400 font-sans leading-relaxed">
              {activeRoom.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800">
            <Link
              href={`/projects/${projectSlug}`}
              className="flex w-full items-center justify-center space-x-2 bg-amber-400 text-neutral-950 font-mono text-xs font-bold py-3 px-4 rounded-sm hover:bg-amber-300 transition-colors uppercase tracking-wider"
            >
              <span>VIEW PROJECT DETAILS →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
