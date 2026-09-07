"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type CameraView = {
  id: string;
  name: string;
  locationLabel: string;
  status: "live" | "offline" | "maintenance" | string;
  previewImage?: string;
};

type LiveCameraViewerProps = {
  siteName: string;
  location: string;
  stageLabel: string;
  percent: number;
  cameras: CameraView[];
};

const ACTIVITY: {
  time: string;
  text: string;
  place: string;
  hot?: boolean;
}[] = [
  {
    time: "10:45 AM",
    text: "Structural inspection complete.",
    place: "North Wing - Sector B",
    hot: true,
  },
  {
    time: "08:15 AM",
    text: "Concrete pour scheduled for tomorrow.",
    place: "Pool Deck perimeter",
  },
  {
    time: "Yesterday, 4:30 PM",
    text: "Material delivery logged: Steel framing.",
    place: "Main Gate",
  },
  {
    time: "Yesterday, 1:00 PM",
    text: "HVAC contractor site walk-through.",
    place: "Interior Levels 1-2",
  },
];

export function LiveCameraViewer({
  siteName,
  location,
  stageLabel,
  percent,
  cameras,
}: LiveCameraViewerProps) {
  const [activeId, setActiveId] = useState(cameras[0]?.id);
  const [now, setNow] = useState("");
  const [clock, setClock] = useState("");
  const frameRef = useRef<HTMLDivElement>(null);

  const active = cameras.find((c) => c.id === activeId) ?? cameras[0];

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      setNow(
        d.toISOString().replace("T", " ").substring(0, 19) + " PST",
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const toggleFullscreen = async () => {
    const el = frameRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => undefined);
    } else {
      await document.exitFullscreen().catch(() => undefined);
    }
  };

  if (!active) {
    return (
      <p className="rounded border border-border bg-surface p-10 text-center text-text/60">
        No cameras configured for this site.
      </p>
    );
  }

  const isLive = active.status === "live";

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col items-start justify-between gap-4 border-b border-border/30 pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 font-display text-4xl font-light tracking-tight text-charcoal md:text-5xl lg:text-6xl">
            {siteName}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-text-secondary md:text-base">
            <span>⌖ {location}</span>
            <span>☁ Clear, 72°F</span>
            <span>◷ {clock || "—"}</span>
            <span className="text-accent">
              {stageLabel} · {percent}%
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded border border-border/50 bg-ivory px-4 py-2 font-sans text-sm font-medium text-charcoal transition-colors hover:border-accent"
          >
            Export Log
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded bg-accent px-4 py-2 font-sans text-sm font-medium text-text-inverse transition-colors hover:bg-accent-hover"
          >
            New Entry
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <div
            ref={frameRef}
            className="group relative aspect-video overflow-hidden rounded bg-ink shadow-sm"
          >
            {active.previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={active.previewImage}
                alt={`${active.name} preview`}
                className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-text-inverse/60">
                Secure preview unavailable
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20" />

            <div className="absolute left-4 top-4 flex items-center gap-2 rounded border border-border/20 bg-border/80 px-3 py-1 backdrop-blur-sm">
              <span
                className={cn(
                  "size-2 rounded-full",
                  isLive ? "animate-pulse bg-live" : "bg-text/40",
                )}
              />
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-charcoal">
                {isLive ? "Live" : active.status}
              </span>
            </div>

            <div className="absolute right-4 top-4 text-right font-sans text-xs text-white drop-shadow">
              <div>
                CAM{" "}
                {String(
                  cameras.findIndex((c) => c.id === active.id) + 1,
                ).padStart(2, "0")}{" "}
                — {active.locationLabel.toUpperCase()} (4K)
              </div>
              <div className="mt-1 font-mono text-[10px] opacity-70">{now}</div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:opacity-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded border border-border/20 bg-surface-2/80 text-sm text-charcoal backdrop-blur-sm"
                  aria-label="Grid overlay"
                  title="Preview control"
                >
                  ⊞
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded border border-border/20 bg-surface-2/80 text-sm text-charcoal backdrop-blur-sm"
                  aria-label="Snapshot (preview only)"
                  title="Snapshot requires authorized session"
                >
                  📷
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded border border-border/20 bg-surface-2/80 text-sm text-charcoal backdrop-blur-sm"
                  aria-label="Fullscreen"
                  onClick={() => void toggleFullscreen()}
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {cameras.map((cam, i) => {
              const selected = cam.id === active.id;
              return (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => setActiveId(cam.id)}
                  className={cn(
                    "relative aspect-video overflow-hidden rounded text-left transition-all",
                    selected
                      ? "border-2 border-accent"
                      : "border-2 border-transparent opacity-80 hover:opacity-100",
                  )}
                  aria-pressed={selected}
                >
                  {cam.previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cam.previewImage}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-border" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 font-sans text-xs font-medium text-white">
                    CAM {String(i + 1).padStart(2, "0")}
                    <br />
                    {cam.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-between rounded border border-border/30 bg-ivory p-5">
              <div className="mb-4 flex items-start justify-between">
                <span className="font-sans text-xs uppercase tracking-wider text-text-secondary">
                  Headcount
                </span>
                <span className="text-accent" aria-hidden>
                  👥
                </span>
              </div>
              <div>
                <span className="block font-display text-3xl text-charcoal">
                  42
                </span>
                <span className="mt-1 block font-sans text-xs text-text-secondary">
                  Active on site
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded border border-border/30 bg-ivory p-5">
              <div className="mb-4 flex items-start justify-between">
                <span className="font-sans text-xs uppercase tracking-wider text-text-secondary">
                  Safety
                </span>
                <span className="text-accent" aria-hidden>
                  ✓
                </span>
              </div>
              <div>
                <span className="block font-display text-3xl text-charcoal">
                  184
                </span>
                <span className="mt-1 block font-sans text-xs text-text-secondary">
                  Days without incident
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-grow flex-col rounded border border-border/30 bg-ivory p-6">
            <h3 className="mb-6 border-b border-border/20 pb-4 font-display text-xl text-charcoal">
              Activity Log
            </h3>
            <div className="max-h-[400px] flex-grow space-y-6 overflow-y-auto pr-2">
              {ACTIVITY.map((item) => (
                <div
                  key={item.time + item.text}
                  className="relative pl-6 before:absolute before:bottom-[-24px] before:left-2 before:top-2 before:w-px before:bg-border/40 before:content-[''] last:before:hidden"
                >
                  <div
                    className={cn(
                      "absolute left-[5px] top-1.5 size-1.5 rounded-full",
                      item.hot ? "bg-accent" : "bg-border",
                    )}
                  />
                  <div
                    className={cn(
                      "mb-1 font-sans text-xs",
                      item.hot
                        ? "font-medium text-accent"
                        : "text-text-secondary",
                    )}
                  >
                    {item.time}
                  </div>
                  <div className="font-sans text-sm text-charcoal">
                    {item.text}
                  </div>
                  <div className="mt-1 font-sans text-xs text-text-secondary">
                    {item.place}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-6 w-full rounded border border-border/40 py-3 font-sans text-sm text-charcoal transition-colors hover:bg-border/50"
            >
              View Full History
            </button>
          </div>

          <p className="font-sans text-[10px] uppercase tracking-wider text-text-secondary">
            Camera credentials never reach the browser. Preview imagery only.
          </p>
        </aside>
      </div>
    </div>
  );
}
