"use client";

import React, { useState } from "react";
import { cn } from "@/lib/cn";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

export type RoomStateMode =
  | "existing"
  | "transformation"
  | "finished"
  | "exploded"
  | "construction";

export interface RoomData {
  slug: string;
  name: string;
  subtitle: string;
  states: Record<
    RoomStateMode,
    {
      label: string;
      image: string;
      videoSrc?: string;
      description: string;
    }
  >;
}

export const ROOM_MATRIX_DATA: RoomData[] = [
  {
    slug: "living-room",
    name: "Living Pavilion",
    subtitle: "Glazed Horizon Living Area",
    states: {
      existing: {
        label: "Existing Site",
        image: STITCH_V2.home.atelier,
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Initial raw framing with exposed structural beams prior to glazing insertion.",
      },
      transformation: {
        label: "AI Renovation Video",
        image: STITCH_V2.tour.living,
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        description: "AI video sequence capturing material layering, plaster application, and glass install.",
      },
      finished: {
        label: "Luxury Finished",
        image: STITCH_V2.tour.living,
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        description: "Completed minimalist sanctuary with travertine floor slabs and floating sofas.",
      },
      exploded: {
        label: "Exploded Technical",
        image: STITCH_V2.detail.exploded,
        description: "Interior isometric showing joinery layers, MEP runs, and acoustic ceiling baffles.",
      },
      construction: {
        label: "Live Site Telemetry",
        image: STITCH_V2.live.construction,
        description: "Real-time trade progress log and structural verification telemetry.",
      },
    },
  },
  {
    slug: "kitchen",
    name: "Culinary Atelier",
    subtitle: "Monolithic Titanium Island",
    states: {
      existing: {
        label: "Existing Site",
        image: STITCH_V2.home.atelier,
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        description: "Raw concrete shell prior to millwork placement.",
      },
      transformation: {
        label: "AI Renovation Video",
        image: STITCH_V2.detail.kitchen,
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyflights.mp4",
        description: "AI transformation showing titanium slab placement and dark oak fitting.",
      },
      finished: {
        label: "Luxury Finished",
        image: STITCH_V2.detail.kitchen,
        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        description: "Completed kitchen featuring integrated Gaggenau appliances and brushed metal counters.",
      },
      exploded: {
        label: "Exploded Technical",
        image: STITCH_V2.detail.exploded,
        description: "Joinery blueprint and cabinet detailing diagram.",
      },
      construction: {
        label: "Live Site Telemetry",
        image: STITCH_V2.live.construction,
        description: "Millwork trade installation log.",
      },
    },
  },
];

export function RoomStateMatrix() {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<RoomStateMode>("finished");

  const room = ROOM_MATRIX_DATA[selectedRoomIndex];
  const currentState = room.states[activeMode];

  const modes: Array<{ key: RoomStateMode; label: string }> = [
    { key: "existing", label: "01 Existing" },
    { key: "transformation", label: "02 Transformation" },
    { key: "finished", label: "03 Luxury Finished" },
    { key: "exploded", label: "04 Technical" },
    { key: "construction", label: "05 Construction" },
  ];

  return (
    <section className="bg-ivory py-32 border-b border-border">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              MULTI-STATE ROOM EXPLORER
            </span>
            <h2 className="mt-2 font-display text-4xl font-light leading-tight text-charcoal md:text-6xl">
              5-State Room <em className="text-accent">Transformation</em>
            </h2>
          </div>
          <div className="flex gap-4">
            {ROOM_MATRIX_DATA.map((r, idx) => (
              <button
                key={r.slug}
                type="button"
                onClick={() => setSelectedRoomIndex(idx)}
                className={cn(
                  "border-b-2 pb-2 font-sans text-sm font-semibold uppercase tracking-wider transition-colors",
                  idx === selectedRoomIndex
                    ? "border-accent text-accent"
                    : "border-transparent text-text-muted hover:text-charcoal",
                )}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mb-12 flex flex-wrap gap-3">
          {modes.map((m) => {
            const isActive = m.key === activeMode;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setActiveMode(m.key)}
                className={cn(
                  "rounded px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300",
                  isActive
                    ? "bg-charcoal text-text-inverse shadow-md"
                    : "bg-surface-2 text-text-muted hover:bg-surface-2 hover:text-charcoal",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Main Display Canvas */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[16/9] overflow-hidden rounded bg-graphite shadow-xl lg:col-span-8">
            {currentState.videoSrc ? (
              <video
                key={currentState.videoSrc}
                src={currentState.videoSrc}
                poster={currentState.image}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={currentState.image}
                alt={currentState.label}
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute bottom-6 left-6 rounded bg-charcoal/80 px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest text-text-inverse backdrop-blur-md">
              STATE: {currentState.label}
            </div>
          </div>

          {/* Description Card */}
          <div className="rounded border border-border bg-surface-2 p-8 lg:col-span-4">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-accent">
              STATE DETAILS
            </span>
            <h3 className="mt-2 mb-4 font-display text-3xl font-light text-charcoal">
              {room.name} — {currentState.label}
            </h3>
            <p className="font-sans text-sm font-light leading-relaxed text-text-muted">
              {currentState.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
