import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell, PageIntro } from "@/components/layout/inner-page-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Akhila is an interior design studio crafting spaces with precision, craft, and transparency.",
};

const VALUES = [
  {
    title: "Precision",
    body: "Drawings and details that protect intent through construction.",
  },
  {
    title: "Transparency",
    body: "Live progress, clear budgets, and decisions you can follow.",
  },
  {
    title: "Craft",
    body: "Material honesty and finish quality that age with grace.",
  },
  {
    title: "Calm",
    body: "Spaces composed for light, privacy, and everyday ritual.",
  },
] as const;

export default function AboutPage() {
  return (
    <InnerPageShell>
      <PageIntro
        eyebrow="Studio"
        title="About Akhila"
        description="We complete interiors for residences and select commercial spaces — ceilings, lighting, colour, paper, glass, and shade, composed as one."
      />

      <EditorialCard>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <FadeUp className="overflow-hidden rounded-2xl lg:col-span-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STITCH_V2.home.atelier}
              alt="Akhila studio craft"
              className="aspect-[16/10] w-full object-cover"
            />
          </FadeUp>
          <FadeUp delay={80} className="lg:col-span-5">
            <p className="mb-3 text-sm text-text-muted">Practice</p>
            <p className="leading-relaxed text-text-secondary">
              Akhila specifies and installs the finishes that complete a room —
              false ceilings, electrical, painting, wallpapers, windows, and
              blinds — under one disciplined process. Clients stay close
              through documented milestones and optional live site monitoring.
            </p>
            <NextLink
              href="/process"
              className="mt-6 inline-flex text-sm font-semibold text-ink-button hover:opacity-70"
            >
              How we build →
            </NextLink>
          </FadeUp>
        </div>
      </EditorialCard>

      <EditorialCard>
        <p className="mb-2 text-sm text-text-muted">Principles</p>
        <h2 className="mb-10 max-w-xl text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
          What we refuse to compromise
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <FadeUp key={value.title} delay={i * 60}>
              <li>
                <h3 className="text-xl font-extrabold text-ink-button">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {value.body}
                </p>
              </li>
            </FadeUp>
          ))}
        </ul>
      </EditorialCard>

      <EditorialCard>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-button">
              Work with us
            </h2>
            <p className="mt-2 max-w-xl text-text-secondary">
              Share your site, program, and timeline — we will respond with next
              steps.
            </p>
          </div>
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
