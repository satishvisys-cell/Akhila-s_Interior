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
import { EditorialCard } from "@/components/sections/editorial-card";
import { InnerPageShell } from "@/components/layout/inner-page-shell";

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
    <article>
      <InnerPageShell>
        <EditorialCard>
          <FadeUp>
            <NextLink
              href="/journal"
              className="mb-6 inline-block text-sm font-semibold text-text-muted hover:text-ink-button"
            >
              ← Journal
            </NextLink>
            <p className="mb-3 text-sm text-text-muted">
              {post.category.replace(/_/g, " ")} · {post.readingTimeMin} min read
            </p>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-ink-button md:text-6xl">
              {post.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
              {post.excerpt}
            </p>
          </FadeUp>
        </EditorialCard>

        <EditorialCard padded={false}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt={post.title}
            className="aspect-[21/9] w-full object-cover md:aspect-[2/1]"
          />
        </EditorialCard>

        <EditorialCard>
          <div className="mx-auto max-w-3xl space-y-6">
            {paragraphs.map((p, i) => (
              <FadeUp key={i} delay={i * 40}>
                <p className="text-lg leading-relaxed text-ink-button/90">{p}</p>
              </FadeUp>
            ))}
            <FadeUp className="border-t border-black/10 pt-10">
              <NextLink
                href="/contact"
                className="inline-flex rounded-md bg-ink-button px-6 py-3 text-sm font-semibold text-white hover:bg-black"
              >
                Start a Conversation
              </NextLink>
            </FadeUp>
          </div>
        </EditorialCard>
      </InnerPageShell>
    </article>
  );
}
