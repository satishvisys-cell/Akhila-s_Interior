import type { Metadata } from "next";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { getMediaMap, getPublishedPosts, mediaUrl } from "@/lib/cms/public";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

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
    interactive: false,
  },
  {
    category: "Architecture",
    title: "Hillside Integration",
    excerpt:
      "A comprehensive case study on the Meridian Residence and the complexities of anchoring monolithic concrete to a living landscape.",
    image: STITCH_V2.home.meridian,
    interactive: false,
  },
  {
    category: "Technology",
    title: "Acoustic Precision",
    excerpt:
      "Integrating concealed sound dampening and tactile wood cladding for complete acoustic serenity.",
    image: STITCH_V2.home.atelier,
    interactive: false,
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
          interactive: false,
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
    <div className="bg-ivory px-8 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-screen-2xl">
        <FadeUp className="mb-24">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="order-2 flex flex-col justify-center pr-0 lg:order-1 lg:col-span-5 lg:pr-8">
              <span className="mb-4 font-sans text-xs uppercase tracking-widest text-accent">
                Editorial
              </span>
              <h1 className="mb-6 font-display text-5xl leading-tight text-charcoal md:text-6xl lg:text-7xl">
                The Language of Light
              </h1>
              <p className="mb-10 max-w-md font-sans text-lg leading-relaxed text-text-secondary">
                {featuredExcerpt}
              </p>
              <NextLink
                href={featuredHref}
                className="group inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest text-charcoal"
              >
                <span className="border-b border-charcoal pb-1 transition-colors group-hover:border-accent group-hover:text-accent">
                  Read Article
                </span>
                <span
                  className="transition-colors group-hover:text-accent"
                  aria-hidden
                >
                  →
                </span>
              </NextLink>
            </div>
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="relative h-[500px] w-full overflow-hidden rounded lg:h-[700px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImage}
                  alt="The Language of Light"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] motion-reduce:hover:scale-100"
                />
              </div>
            </div>
          </div>
        </FadeUp>

        <section>
          <FadeUp className="mb-12 flex items-end justify-between border-b border-border/20 pb-4">
            <h2 className="font-display text-3xl text-charcoal">
              Latest Entries
            </h2>
            <NextLink
              href="/gallery"
              className="font-sans text-sm uppercase tracking-widest text-text-secondary transition-colors hover:text-accent"
            >
              View Archives
            </NextLink>
          </FadeUp>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry, i) => (
              <FadeUp key={entry.title} delay={i * 70}>
                <article className="group flex h-full flex-col">
                  <NextLink href={entry.href} className="relative mb-6 block">
                    {entry.interactive ? (
                      <div className="aspect-[4/5] w-full overflow-hidden rounded bg-surface p-8">
                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded border border-border/20">
                          <div className="absolute inset-0 bg-gradient-to-br from-ivory to-surface-2 opacity-50" />
                          <span
                            className="relative z-10 text-6xl text-accent/50 transition-transform duration-700 group-hover:scale-110"
                            aria-hidden
                          >
                            ⧉
                          </span>
                          <div className="absolute bottom-4 left-4 z-10 font-sans text-xs uppercase tracking-widest text-text-secondary/70">
                            Interactive
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[4/5] w-full overflow-hidden rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={entry.image}
                          alt={entry.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </NextLink>
                  <div className="flex flex-grow flex-col">
                    <span className="mb-3 font-sans text-xs uppercase tracking-widest text-text-secondary">
                      {entry.category}
                    </span>
                    <h3 className="mb-3 font-display text-2xl text-charcoal">
                      {entry.title}
                    </h3>
                    <p className="mb-6 flex-grow font-sans leading-relaxed text-text-secondary">
                      {entry.excerpt}
                    </p>
                    <NextLink
                      href={entry.href}
                      className="mt-auto font-sans text-sm font-medium uppercase tracking-widest text-accent transition-colors hover:text-charcoal"
                    >
                      Read More
                    </NextLink>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
