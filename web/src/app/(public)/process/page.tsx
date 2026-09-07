import type { Metadata } from "next";
import NextLink from "next/link";
import { EditorialCard } from "@/components/sections/editorial-card";
import { ProcessJourney } from "@/components/sections/process-journey";
import { InnerPageShell, PageIntro } from "@/components/layout/inner-page-shell";
import { EDITORIAL } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "How We Build",
  description:
    "An eight-stage journey from consultation to handover — transparent, paced, and intentional.",
};

const PROMISES = [
  {
    title: "One standard of craft",
    body: "Ceilings, electrics, paint, paper, glass, and blinds specified as a single interior — not separate trades.",
  },
  {
    title: "Visible progress",
    body: "Weekly updates and optional live site access so stakeholders always know where the rooms stand.",
  },
  {
    title: "Calm handover",
    body: "Snags closed, manuals ready, and a walkthrough that feels like arriving home — not a site visit.",
  },
] as const;

export default function ProcessPage() {
  return (
    <InnerPageShell>
      <PageIntro
        eyebrow="Process"
        title="How We Build"
        description="Interior design is a journey. Ours is paced, documented, and shared — so you always know where the project stands."
        actions={
          <NextLink
            href="/contact"
            className="btn-press inline-flex h-11 items-center rounded-md bg-ink-button px-5 text-sm font-semibold text-white hover:bg-black"
          >
            Start a Project
          </NextLink>
        }
      />

      <EditorialCard padded={false} className="overflow-hidden font-editorial" motion>
        <div className="grid md:grid-cols-12">
          <div className="relative min-h-[240px] md:col-span-7 md:min-h-[360px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-reveal-image
              src={EDITORIAL.hero}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Eight stages
              </p>
              <p className="mt-2 max-w-md text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                From first conversation to keys in hand.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-8 p-6 md:col-span-5 md:p-10">
            {PROMISES.map((item, i) => (
              <div
                key={item.title}
                className="rounded-xl border border-transparent p-1 transition-colors duration-300 hover:border-black/5 hover:bg-black/[0.02]"
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink-button">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </EditorialCard>

      <ProcessJourney />
    </InnerPageShell>
  );
}
