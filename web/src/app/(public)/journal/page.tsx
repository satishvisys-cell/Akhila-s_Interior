import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { getMediaMap, getPublishedPosts, mediaUrl } from "@/lib/cms/public";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell } from "@/components/layout/inner-page-shell";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on craft, process, and places — from the Akhila studio.",
};

const FALLBACK_ENTRIES = [
  {
    category: "Case Study",
    title: "Material Honesty",
    excerpt:
      "An uncompromising exploration of raw stone, cast concrete, and aged bronze in our latest studio space.",
    image: STITCH_V2.home.hero,
  },
  {
    category: "Interiors",
    title: "Hillside Integration",
    excerpt:
      "A comprehensive case study on the Meridian Residence and the complexities of anchoring monolithic concrete to a living landscape.",
    image: STITCH_V2.home.meridian,
  },
  {
    category: "Technology",
    title: "Acoustic Precision",
    excerpt:
      "Integrating concealed sound dampening and tactile wood cladding for complete acoustic serenity.",
    image: STITCH_V2.home.atelier,
  },
] as const;

export default async function JournalPage() {
  const [posts, media] = await Promise.all([
    getPublishedPosts(),
    getMediaMap(),
  ]);

  const entries =
    posts.length > 0
      ? posts.slice(0, 3).map((post, i) => ({
          category: post.category.replace(/_/g, " "),
          title: post.title,
          excerpt: post.excerpt,
          image:
            mediaUrl(media, post.coverMediaId) ??
            FALLBACK_ENTRIES[i % FALLBACK_ENTRIES.length].image,
          href: `/journal/${post.slug}`,
        }))
      : FALLBACK_ENTRIES.map((e) => ({
          ...e,
          href: "/journal",
        }));

  const featured =
    posts.find((p) => p.slug === "the-language-of-light") ?? posts[0];
  const featuredHref = featured ? `/journal/${featured.slug}` : "/contact";
  const featuredImage = featured
    ? (mediaUrl(media, featured.coverMediaId) ?? STITCH_V2.home.atelier)
    : STITCH_V2.home.atelier;
  const featuredExcerpt =
    featured?.excerpt ??
    "An exploration of spatial poetry and how natural illumination shapes our perception of form, volume, and material truth within the built environment.";

  return (
    <InnerPageShell>
      <EditorialCard>
        <FadeUp className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-3 text-sm text-text-muted">Latest News</p>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-ink-button md:text-6xl">
              The Language of Light
            </h1>
            <p className="mb-8 max-w-md leading-relaxed text-text-secondary">
              {featuredExcerpt}
            </p>
            <NextLink
              href={featuredHref}
              className="inline-flex items-center rounded-md bg-ink-button px-5 py-3 text-sm font-semibold text-white hover:bg-black"
            >
              Read Article →
            </NextLink>
          </div>
          <div className="overflow-hidden rounded-2xl lg:col-span-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImage}
              alt="The Language of Light"
              className="aspect-[16/11] w-full object-cover"
            />
          </div>
        </FadeUp>
      </EditorialCard>

      <EditorialCard>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-button">
            Latest Entries
          </h2>
          <NextLink
            href="/designs"
            className="text-sm font-semibold text-text-muted hover:text-ink-button"
          >
            View Archives
          </NextLink>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {entries.map((entry, i) => (
            <FadeUp key={entry.title} delay={i * 70}>
              <article>
                <NextLink href={entry.href} className="group block">
                  <div className="mb-4 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.image}
                      alt={entry.title}
                      className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm text-text-muted">{entry.category}</p>
                  <h3 className="mt-1 text-xl font-extrabold text-ink-button">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {entry.excerpt}
                  </p>
                  <span className="mt-3 inline-block text-sm font-semibold text-ink-button">
                    Read More
                  </span>
                </NextLink>
              </article>
            </FadeUp>
          ))}
        </div>
      </EditorialCard>
    </InnerPageShell>
  );
}
