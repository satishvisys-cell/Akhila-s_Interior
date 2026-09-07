"use client";

import React from "react";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

export interface ProgressMilestone {
  stage: string;
  percent: number;
  status: "complete" | "in_progress" | "pending";
}

export const MILESTONES: ProgressMilestone[] = [
  { stage: "01 Foundation & Excavation", percent: 100, status: "complete" },
  { stage: "02 UHPC Structural Shear Walls", percent: 100, status: "complete" },
  { stage: "03 Roof & Perimeter Masonry", percent: 92, status: "in_progress" },
  { stage: "04 MEP & Electrical Infrastructure", percent: 72, status: "in_progress" },
  { stage: "05 Glazing & Facade Sliders", percent: 64, status: "in_progress" },
  { stage: "06 Custom Millwork & Interior Joinery", percent: 38, status: "in_progress" },
  { stage: "07 Stone & Plaster Finishing", percent: 15, status: "in_progress" },
];

export function ConstructionTelemetry() {
  return (
    <section className="bg-ivory py-32 border-b border-border">
      <div className="mx-auto max-w-7xl px-8">
        <FadeUp className="mb-16">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            CONSTRUCTION TELEMETRY
          </span>
          <h2 className="mt-2 font-display text-4xl font-light leading-tight text-charcoal md:text-6xl">
            Live Project <em className="text-accent">Milestones</em>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Milestone Progress List */}
          <div className="space-y-6 lg:col-span-7">
            {MILESTONES.map((m) => (
              <div key={m.stage} className="rounded border border-border bg-surface-2 p-6">
                <div className="flex items-center justify-between mb-2 font-sans text-xs font-bold uppercase tracking-wider text-charcoal">
                  <span>{m.stage}</span>
                  <span className="text-accent">{m.percent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded bg-surface-2">
                  <div
                    className="h-full bg-accent transition-all duration-1000"
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Daily Site Feed Preview */}
          <div className="rounded border border-border bg-surface-2 p-8 lg:col-span-5">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-accent">
              DAILY SITE TELEMETRY LOG
            </span>
            <h3 className="mt-2 mb-4 font-display text-2xl font-light text-charcoal">
              Site Log #142 — Glazing Installation
            </h3>
            <div className="aspect-video w-full overflow-hidden rounded border border-border mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STITCH_V2.live.construction}
                alt="Construction Telemetry"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="font-sans text-xs font-light leading-relaxed text-text-muted">
              Structural steel anchors verified for perimeter slider tracks. Low-iron double-glazed panels positioned under crane supervisor telemetry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
