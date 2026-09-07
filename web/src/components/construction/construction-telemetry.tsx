"use client";

import React from "react";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { EditorialCard } from "@/components/sections/editorial-card";

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
    <EditorialCard className="font-editorial">
      <FadeUp className="mb-10">
        <p className="text-sm text-text-muted">Construction Telemetry</p>
        <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-ink-button md:text-5xl">
          Live Project Milestones
        </h2>
      </FadeUp>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          {MILESTONES.map((m) => (
            <div key={m.stage}>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink-button">
                <span>{m.stage}</span>
                <span className="text-text-muted">{m.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-ink-button"
                  style={{ width: `${m.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5">
          <p className="text-sm text-text-muted">Daily Site Log</p>
          <h3 className="mt-1 mb-4 text-xl font-extrabold text-ink-button">
            Site Log #142 — Glazing Installation
          </h3>
          <div className="mb-4 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STITCH_V2.live.construction}
              alt="Construction Telemetry"
              className="aspect-video w-full object-cover"
            />
          </div>
          <p className="text-sm leading-relaxed text-text-muted">
            Structural steel anchors verified for perimeter slider tracks. Low-iron
            double-glazed panels positioned under crane supervisor telemetry.
          </p>
        </div>
      </div>
    </EditorialCard>
  );
}
