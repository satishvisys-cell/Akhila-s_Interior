import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPageBySlug } from "@/lib/cms/public";
import { resolvePageBlocks } from "@/lib/cms/resolve-blocks";
import { PageBlockRenderer } from "@/components/cms/page-block-renderer";

type PageProps = { params: Promise<{ slug: string }> };

/**
 * Generic CMS page route — the live counterpart of the admin Page Builder.
 *
 * Next.js resolves more specific static routes (`/about`, `/contact`,
 * `/projects`, etc.) before this catch-all, so existing hand-built routes
 * are unaffected. Any *new* page an admin creates and publishes through
 * `/admin/pages` is served here immediately — no code change required,
 * satisfying the data-driven page architecture rule.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.seo.title ?? page.title,
    description: page.seo.description,
    alternates: page.seo.canonicalUrl ? { canonical: page.seo.canonicalUrl } : undefined,
    robots: page.seo.noIndex ? { index: false } : undefined,
  };
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) notFound();

  const blocks = await resolvePageBlocks(page.blocks);

  if (blocks.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <h1 className="font-display text-3xl font-light text-charcoal">{page.title}</h1>
        <p className="mt-4 font-sans text-sm text-text-muted">
          This page has been published but has no visible sections yet.
        </p>
      </div>
    );
  }

  return <PageBlockRenderer blocks={blocks} />;
}
