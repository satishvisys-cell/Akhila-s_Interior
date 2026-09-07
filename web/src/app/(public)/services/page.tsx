import type { Metadata } from "next";
import NextLink from "next/link";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InteriorServiceGrid } from "@/components/sections/interior-service-grid";
import { InnerPageShell, PageIntro } from "@/components/layout/inner-page-shell";

export const metadata: Metadata = {
  title: "Services",
  description:
    "False ceilings, electrical, painting, wallpapers, windows, and blinds — interior finishes composed as one.",
};

export default function ServicesPage() {
  return (
    <InnerPageShell>
      <PageIntro
        eyebrow="Our Services"
        title="Interior finishes, done as one"
        description="The trades that make a room complete — ceiling, light, colour, paper, glass, and shade — specified and installed with the same care as the plan."
      />

      <EditorialCard className="font-editorial">
        <InteriorServiceGrid cta="contact" withAnchors />
      </EditorialCard>

      <EditorialCard>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-text-secondary">
            Ready to specify a ceiling, a palette, or a full interior package?
            Tell us the rooms and we will respond with next steps.
          </p>
          <NextLink
            href="/contact"
            className="inline-flex h-11 items-center rounded-md bg-ink-button px-5 text-sm font-semibold text-white hover:bg-black"
          >
            Start a Project
          </NextLink>
        </div>
      </EditorialCard>
    </InnerPageShell>
  );
}
