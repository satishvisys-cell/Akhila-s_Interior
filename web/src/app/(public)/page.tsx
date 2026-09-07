import type { Metadata } from "next";
import { MaisonHero } from "@/components/sections/maison-hero";
import { TimelessIntro } from "@/components/sections/timeless-intro";
import { FeaturedCollection } from "@/components/sections/featured-collection";
import { WhatWeOffer } from "@/components/sections/what-we-offer";
import { CategoryPreview } from "@/components/sections/category-preview";
import { RoomAccordion } from "@/components/sections/room-accordion";
import { InspiredBanner } from "@/components/sections/inspired-banner";
import { LiveProjectsCarousel } from "@/components/sections/live-projects-carousel";

export const metadata: Metadata = {
  title: "Akhila — Interior Design & Inspired Living",
  description:
    "Timeless interiors for modern living — false ceilings, electrical, painting, wallpapers, windows, and blinds, specified as one."
};

export default function HomePage() {
  return (
    <>
      <MaisonHero />
      <div className="canvas-sky px-2.5 py-2.5 sm:px-3 sm:py-3 md:px-5 md:py-5">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:gap-4 md:gap-5">
          <TimelessIntro />
          <FeaturedCollection />
          <WhatWeOffer />
          <CategoryPreview />
          <RoomAccordion />
          <LiveProjectsCarousel />
          <InspiredBanner />
        </div>
      </div>
    </>
  );
}
