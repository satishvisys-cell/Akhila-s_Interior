"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { getAdaptiveVideoStream, type VideoAsset } from "@/lib/media/media-asset";

export interface VideoPlayerProps {
  asset: VideoAsset;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  className?: string;
  overlayText?: string;
  onEnded?: () => void;
}

export function VideoPlayer({
  asset,
  autoPlay = true,
  loop = true,
  muted = true,
  showControls = true,
  className,
  overlayText,
  onEnded,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [streamInfo, setStreamInfo] = useState<{ src: string; poster: string } | null>(null);

  useEffect(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1440;
    const info = getAdaptiveVideoStream(asset, width);
    const frameId = requestAnimationFrame(() => setStreamInfo(info));
    return () => cancelAnimationFrame(frameId);
  }, [asset]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((cur / dur) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    const dur = videoRef.current.duration || 1;
    videoRef.current.currentTime = (val / 100) * dur;
    setProgress(val);
  };

  const posterSrc = streamInfo?.poster || asset.poster;
  const videoSrc = streamInfo?.src || asset.poster;

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded bg-graphite",
        className,
      )}
    >
      {/* Poster Image Crossfade */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt={asset.alt}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          isLoaded && !hasError ? "opacity-0" : "opacity-100",
        )}
      />

      {/* Video Element */}
      {!hasError && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          onError={() => setHasError(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-700",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {/* Overlay Title / Label */}
      {overlayText && (
        <div className="absolute top-6 left-6 z-10 font-sans text-xs font-semibold uppercase tracking-[0.25em] text-text-inverse drop-shadow-md">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {overlayText}
        </div>
      )}

      {/* Custom Controls Bar */}
      {showControls && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {/* Progress Bar */}
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer appearance-none rounded bg-white/20 accent-accent hover:bg-white/40"
          />

          <div className="flex items-center justify-between font-sans text-xs uppercase tracking-wider text-text-inverse">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="transition-colors hover:text-accent"
                aria-label={isPlaying ? "Pause Video" : "Play Video"}
              >
                {isPlaying ? "PAUSE" : "PLAY"}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="transition-colors hover:text-accent"
                aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
              >
                {isMuted ? "UNMUTE" : "MUTED"}
              </button>
            </div>
            <span className="font-mono text-[10px] text-text-inverse/70">
              {asset.category.toUpperCase()} • {asset.durationSec}S
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
