import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell, PageIntro } from "@/components/layout/inner-page-shell";
import {
  getAboutContent,
  getMediaMap,
  mediaUrl,
} from "@/lib/cms/public";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent();
  return {
    title: about?.seo.title ?? "About",
    description:
      about?.seo.description ??
      "Akhila is an interior design studio crafting spaces with precision, craft, and transparency.",
  };
}

export default async function AboutPage() {
  const [about, mediaMap] = await Promise.all([
    getAboutContent(),
    getMediaMap(),
  ]);

  if (!about) {
    return (
      <InnerPageShell>
        <PageIntro
          eyebrow="Studio"
          title="About Akhila"
          description="About content is being prepared."
        />
      </InnerPageShell>
    );
  }

  const heroImage =
    mediaUrl(mediaMap, about.hero.mediaId) ??
    mediaUrl(mediaMap, about.owner.photoMediaId) ??
    STITCH_V2.home.atelier;

  const ownerPhoto =
    mediaUrl(mediaMap, about.owner.photoMediaId) ?? heroImage;

  const commitments = about.commitments
    .filter((c) => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const achievements = about.achievements
    .filter((c) => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const trophies = about.trophies
    .filter((c) => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const values = about.values
    .filter((c) => c.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <InnerPageShell>
      <PageIntro
        eyebrow={about.hero.eyebrow ?? "Studio"}
        title={about.hero.title}
        description={about.hero.intro}
      />

      <EditorialCard>
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <FadeUp className="overflow-hidden rounded-2xl lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ownerPhoto}
              alt={about.owner.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </FadeUp>
          <FadeUp delay={80} className="lg:col-span-7">
            <p className="mb-2 text-sm text-text-muted">About the owner</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
              {about.owner.name}
            </h2>
            <p className="mt-1 text-sm uppercase tracking-widest text-text-muted">
              {about.owner.title}
            </p>
            <p className="mt-6 leading-relaxed text-text-secondary whitespace-pre-line">
              {about.owner.bio}
            </p>
            {about.owner.quote ? (
              <blockquote className="mt-8 border-l border-black/15 pl-5 text-lg italic text-ink-button">
                “{about.owner.quote}”
              </blockquote>
            ) : null}
            <NextLink
              href="/process"
              className="mt-6 inline-flex text-sm font-semibold text-ink-button hover:opacity-70"
            >
              How we build →
            </NextLink>
          </FadeUp>
        </div>
      </EditorialCard>

      {commitments.length > 0 ? (
        <EditorialCard>
          <p className="mb-2 text-sm text-text-muted">Commitments</p>
          <h2 className="mb-10 max-w-xl text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            What we stand by
          </h2>
          <ul className="grid gap-8 md:grid-cols-3">
            {commitments.map((item, i) => (
              <FadeUp key={item.id} delay={i * 60}>
                <li>
                  <h3 className="text-xl font-extrabold text-ink-button">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                </li>
              </FadeUp>
            ))}
          </ul>
        </EditorialCard>
      ) : null}

      {achievements.length > 0 ? (
        <EditorialCard>
          <p className="mb-2 text-sm text-text-muted">Achievements</p>
          <h2 className="mb-10 max-w-xl text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            Milestones
          </h2>
          <ul className="space-y-8">
            {achievements.map((item, i) => (
              <FadeUp key={item.id} delay={i * 50}>
                <li className="grid gap-2 border-b border-black/8 pb-8 last:border-0 md:grid-cols-12">
                  <p className="text-sm text-text-muted md:col-span-2">
                    {item.year ?? "—"}
                  </p>
                  <div className="md:col-span-10">
                    <h3 className="text-xl font-extrabold text-ink-button">
                      {item.url ? (
                        <a
                          href={item.url}
                          className="hover:opacity-70"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {item.body}
                    </p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </EditorialCard>
      ) : null}

      {trophies.length > 0 ? (
        <EditorialCard>
          <p className="mb-2 text-sm text-text-muted">Trophies</p>
          <h2 className="mb-10 max-w-xl text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            Recognition
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2">
            {trophies.map((item, i) => {
              const img = mediaUrl(mediaMap, item.mediaId);
              return (
                <FadeUp key={item.id} delay={i * 60}>
                  <li className="flex gap-5">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt=""
                        className="size-20 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div
                        className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-ink-button/5 text-2xl font-extrabold text-ink-button"
                        aria-hidden
                      >
                        ★
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-extrabold text-ink-button">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-text-muted">
                        {[item.organization, item.year].filter(Boolean).join(" · ")}
                      </p>
                      {item.body ? (
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                          {item.body}
                        </p>
                      ) : null}
                    </div>
                  </li>
                </FadeUp>
              );
            })}
          </ul>
        </EditorialCard>
      ) : null}

      {values.length > 0 ? (
        <EditorialCard>
          <p className="mb-2 text-sm text-text-muted">Principles</p>
          <h2 className="mb-10 max-w-xl text-3xl font-extrabold tracking-tight text-ink-button md:text-4xl">
            What we refuse to compromise
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <FadeUp key={value.id} delay={i * 60}>
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
      ) : null}

      {about.cta ? (
        <EditorialCard>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink-button">
                {about.cta.title}
              </h2>
              {about.cta.body ? (
                <p className="mt-2 max-w-xl text-text-secondary">
                  {about.cta.body}
                </p>
              ) : null}
            </div>
            <NextLink
              href={about.cta.buttonHref}
              className="inline-flex h-11 items-center rounded-md bg-ink-button px-5 text-sm font-semibold text-white hover:bg-black"
            >
              {about.cta.buttonLabel}
            </NextLink>
          </div>
        </EditorialCard>
      ) : null}
    </InnerPageShell>
  );
}
