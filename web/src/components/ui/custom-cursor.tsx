"use client";

import React, { useEffect, useState } from "react";

export type CursorMode = "default" | "view" | "drag" | "explore" | "open" | "play";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch devices or reduced motion
    if (typeof window !== "undefined") {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (isTouch || reducedMotion) {
        const timer = requestAnimationFrame(() => setIsTouchDevice(true));
        return () => cancelAnimationFrame(timer);
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check cursor data mode attribute from target elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor") as CursorMode | null;
        if (cursorAttr) {
          setMode(cursorAttr);
        } else {
          setMode("default");
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/40 transition-transform duration-100 ease-out ${
          mode === "default"
            ? "h-8 w-8 bg-amber-400/10 backdrop-blur-[1px]"
            : "h-16 w-16 border-amber-300 bg-neutral-950/80 shadow-2xl backdrop-blur-md scale-110"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {mode === "default" ? (
          <div className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        ) : (
          <span className="font-sans text-[10px] font-bold tracking-widest text-amber-200 uppercase">
            {mode}
          </span>
        )}
      </div>
    </div>
  );
}
