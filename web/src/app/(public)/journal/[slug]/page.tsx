import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import {
  getMediaMap,
  getPublishedPostBySlug,
  getPublishedPosts,
  mediaUrl,
} from "@/lib/cms/public";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Journal" };
  return { title: post.title, description: post.excerpt };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const media = await getMediaMap();
  const cover =
    mediaUrl(media, post.coverMediaId) ?? STITCH_V2.home.atelier;
  const paragraphs = post.body.split(/\n\n+/).filter(Boolean);

  return (
    <article className="bg-bg pb-24 pt-[calc(var(--header-h)+3rem)]">
      <div className="mx-auto max-w-3xl px-8 md:px-12">
        <FadeUp>
          <NextLink
            href="/journal"
            className="mb-10 inline-block font-sans text-xs uppercase tracking-widest text-accent"
          >
            ← Journal
          </NextLink>
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.15em] text-accent">
            {post.category.replace(/_/g, " ")} · {post.readingTimeMin} min read
          </p>
          <h1 className="mb-8 font-display text-4xl font-light tracking-tight text-graphite md:text-6xl">
            {post.title}
          </h1>
          <p className="mb-12 font-sans text-lg font-light leading-relaxed text-text/70">
            {post.excerpt}
          </p>
        </FadeUp>
      </div>

      <FadeUp className="mx-auto mb-16 max-w-5xl px-8 md:px-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={post.title}
          className="aspect-[21/9] w-full rounded object-cover md:aspect-[2/1]"
        />
      </FadeUp>

      <div className="mx-auto max-w-3xl space-y-6 px-8 md:px-12">
        {paragraphs.map((p, i) => (
          <FadeUp key={i} delay={i * 40}>
            <p className="font-sans text-lg font-light leading-relaxed text-graphite/90">
              {p}
            </p>
          </FadeUp>
        ))}

        <FadeUp className="border-t border-border pt-12">
          <NextLink
            href="/contact"
            className="inline-flex rounded bg-accent px-8 py-3 font-sans text-xs uppercase tracking-widest text-text-inverse hover:bg-accent-hover"
          >
            Start a Conversation
          </NextLink>
        </FadeUp>
      </div>
    </article>
  );
}
