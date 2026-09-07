"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/cn";

export interface BeforeAfterMediaItem {
  type: "image" | "video";
  src: string;
  poster?: string;
  label: string;
}

export interface BeforeAfterVideoProps {
  before: BeforeAfterMediaItem;
  after: BeforeAfterMediaItem;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function BeforeAfterVideo({
  before,
  after,
  className,
  title = "Interior Transformation",
  subtitle = "Drag slider to compare raw structural state with completed luxury interior",
}: BeforeAfterVideoProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pct = (x / rect.width) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    setSliderPosition(pct);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {(title || subtitle) && (
        <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              BEFORE & AFTER REVEAL
            </span>
            <h3 className="font-display text-3xl font-light text-charcoal">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="max-w-md font-sans text-xs text-text-muted">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main Slider Container */}
      <div
        ref={containerRef}
        className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-2xl bg-graphite"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER / FINISHED MEDIA (Background) */}
        <div className="absolute inset-0 h-full w-full">
          {after.type === "video" ? (
            <video
              src={after.src}
              poster={after.poster}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={after.src}
              alt={after.label}
              className="h-full w-full object-cover"
            />
          )}
          <span className="absolute right-6 top-6 z-10 rounded bg-white px-3 py-1 font-sans text-xs font-semibold text-ink-button shadow-sm">
            {after.label}
          </span>
        </div>

        {/* BEFORE / EXISTING MEDIA (Clipped Foreground) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden border-r border-ivory/50 shadow-2xl"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="absolute inset-y-0 left-0 h-full"
            style={{ width: containerWidth ? `${containerWidth}px` : "100%" }}
          >
            {before.type === "video" ? (
              <video
                src={before.src}
                poster={before.poster}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={before.src}
                alt={before.label}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <span className="absolute left-6 top-6 z-10 rounded bg-terracotta px-3 py-1 font-sans text-xs font-semibold text-white shadow-sm">
            {before.label}
          </span>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute inset-y-0 z-20 flex -translate-x-1/2 items-center justify-center cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/5 bg-white text-ink-button shadow-xl transition-transform hover:scale-110">
            <span className="font-editorial text-sm tracking-tighter">‹ ›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
