/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";

export interface GalleryItemData {
  id: string;
  title: string;
  category: "Exterior" | "Interior" | "Construction" | "Material" | "Lighting";
  location: string;
  year: number;
  imageUrl: string;
  aspectRatio: "aspect-square" | "aspect-[4/3]" | "aspect-[3/4]" | "aspect-[16/9]";
}

export const GALLERY_ITEMS: GalleryItemData[] = [
  { id: "g1", title: "Cantilevered Glazing Facade", category: "Exterior", location: "Bengaluru", year: 2026, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", aspectRatio: "aspect-[16/9]" },
  { id: "g2", title: "Monolithic Living Pavilion", category: "Interior", location: "Bengaluru", year: 2026, imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", aspectRatio: "aspect-[4/3]" },
  { id: "g3", title: "Board-Formed Concrete Pour", category: "Construction", location: "Hyderabad", year: 2025, imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80", aspectRatio: "aspect-[3/4]" },
  { id: "g4", title: "Honed Travertine Floor Slabs", category: "Material", location: "Chennai", year: 2026, imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", aspectRatio: "aspect-square" },
  { id: "g5", title: "Perimeter Recessed Slit Lights", category: "Lighting", location: "Bengaluru", year: 2026, imageUrl: "https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1200&q=80", aspectRatio: "aspect-[16/9]" },
  { id: "g6", title: "Nero Marquina Spa Tub", category: "Interior", location: "Bengaluru", year: 2026, imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", aspectRatio: "aspect-[4/3]" },
];

export function GalleryViewer() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["ALL", "Exterior", "Interior", "Construction", "Material", "Lighting"];

  const filteredItems = selectedCategory === "ALL"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  return (
    <div className="w-full bg-neutral-950 text-neutral-100 py-12 px-6 md:px-12">
      {/* Header & Filter Category Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-800 pb-8">
        <div>
          <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">
            VISUAL ARCHIVE & DOCUMENTATION
          </span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-light text-neutral-100">
            Architectural Gallery
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider transition-all uppercase ${
                selectedCategory === cat
                  ? "bg-amber-400 text-neutral-950 font-bold"
                  : "bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(idx)}
            data-cursor="view"
            className="group relative cursor-pointer overflow-hidden border border-neutral-800 bg-neutral-900"
          >
            <div className={`relative w-full ${item.aspectRatio} overflow-hidden`}>
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase">
                  {item.category}
                </span>
                <span className="font-mono text-[10px] text-neutral-400">
                  {item.year}
                </span>
              </div>
              <h3 className="mt-1 font-display text-lg text-neutral-100 font-light group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-xl p-4 md:p-10">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 font-mono text-xs text-amber-400 border border-amber-400/40 px-4 py-2 rounded-full uppercase tracking-wider hover:bg-amber-400 hover:text-neutral-950 transition-all z-50"
          >
            CLOSE [ESC]
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
            <img
              src={activeLightboxItem.imageUrl}
              alt={activeLightboxItem.title}
              className="max-h-[70vh] w-auto object-contain border border-neutral-800 shadow-2xl"
            />

            <div className="mt-6 flex flex-col md:flex-row items-center justify-between w-full border-t border-neutral-800 pt-4">
              <div>
                <span className="font-mono text-xs text-amber-400 uppercase">
                  {activeLightboxItem.category} · {activeLightboxItem.location}
                </span>
                <h2 className="font-display text-2xl font-light text-neutral-100">
                  {activeLightboxItem.title}
                </h2>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0 font-mono text-xs text-neutral-400">
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1))}
                  className="hover:text-amber-300 uppercase"
                >
                  ← PREVIOUS
                </button>
                <span>
                  {lightboxIndex! + 1} / {filteredItems.length}
                </span>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0))}
                  className="hover:text-amber-300 uppercase"
                >
                  NEXT →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
