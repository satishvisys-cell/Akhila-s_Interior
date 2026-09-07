import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

export const metadata: Metadata = {
  title: "About",
  description:
    "Akhila is an architecture, design, and construction studio crafting spaces with precision and transparency.",
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
    <div className="bg-bg pt-[calc(var(--header-h)+2rem)]">
      <div className="mx-auto max-w-7xl px-8 md:px-12">
        <FadeUp className="mb-16 max-w-3xl md:mb-24">
          <span className="mb-4 block font-sans text-xs uppercase tracking-[0.3em] text-accent">
            Studio
          </span>
          <h1 className="mb-6 font-display text-5xl font-light tracking-tight text-graphite md:text-7xl">
            About <em className="text-accent">Akhila</em>
          </h1>
          <p className="text-lg font-light leading-relaxed text-text/70">
            We design and build residences and select commercial spaces where
            architecture becomes experience — from first sketch to final
            handover.
          </p>
        </FadeUp>

        <div className="mb-24 grid gap-12 lg:grid-cols-12">
          <FadeUp className="lg:col-span-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={STITCH_V2.home.atelier}
              alt="Akhila studio craft"
              className="aspect-[16/10] w-full rounded object-cover"
            />
          </FadeUp>
          <FadeUp
            delay={80}
            className="flex flex-col justify-center lg:col-span-4 lg:col-start-9"
          >
            <p className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-text/50">
              Practice
            </p>
            <p className="font-light leading-relaxed text-text/70">
              Akhila brings architecture, interiors, and construction under one
              disciplined process. Clients stay close to the work through
              documented milestones and optional live site monitoring.
            </p>
            <NextLink
              href="/process"
              className="mt-8 font-sans text-xs uppercase tracking-widest text-accent"
            >
              How we build →
            </NextLink>
          </FadeUp>
        </div>
      </div>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-8 py-20 md:px-12 md:py-28">
          <FadeUp>
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-accent">
              Principles
            </p>
            <h2 className="mb-12 max-w-xl font-display text-4xl font-light text-graphite md:text-5xl">
              What we refuse to compromise
            </h2>
          </FadeUp>
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <FadeUp key={value.title} delay={i * 60}>
                <li>
                  <h3 className="font-display text-2xl text-graphite">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-text/70">
                    {value.body}
                  </p>
                </li>
              </FadeUp>
            ))}
          </ul>
        </div>
      </section>

      <FadeUp className="mx-auto flex max-w-7xl flex-col gap-6 px-8 py-20 md:flex-row md:items-center md:justify-between md:px-12">
        <div>
          <h2 className="font-display text-4xl text-graphite">Work with us</h2>
          <p className="mt-3 max-w-xl font-light text-text/70">
            Share your site, program, and timeline — we will respond with next
            steps.
          </p>
        </div>
        <NextLink
          href="/contact"
          className="inline-flex h-11 items-center rounded bg-accent px-6 text-xs uppercase tracking-widest text-text-inverse hover:bg-accent-hover"
        >
          Start a Project
        </NextLink>
      </FadeUp>
    </div>
  );
}
