import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getById, initializeCmsStore } from "@/lib/cms/store";
import { resolvePageBlocks } from "@/lib/cms/resolve-blocks";
import { PageBlockRenderer } from "@/components/cms/page-block-renderer";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Page Preview",
  robots: { index: false },
};

/**
 * Admin preview — renders through the SAME `<PageBlockRenderer>` used by the
 * live public `/[slug]` route. Previously this rendered a debug `<pre>` JSON
 * dump of block props, which meant "Preview" never reflected what a visitor
 * would actually see — a fake CMS control. Fixed: what you preview here is
 * pixel-for-pixel what publishes.
 */
export default async function AdminPagePreview({ params }: PageProps) {
  await requireAdmin("page:write");
  const { id } = await params;
  await initializeCmsStore();
  const page = await getById("pages", id);
  if (!page) notFound();

  const blocks = await resolvePageBlocks(page.blocks);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-ivory px-6 py-4 md:px-12">
        <p className="label-caps text-text-muted">
          Preview · draft safe · /{page.slug} · {page.publishStatus}
        </p>
        <h1 className="mt-1 font-display text-h2 text-text">{page.title}</h1>
      </header>
      <main>
        {blocks.length === 0 ? (
          <p className="px-6 py-16 text-text-muted md:px-12">This page has no blocks yet.</p>
        ) : (
          <PageBlockRenderer blocks={blocks} />
        )}
      </main>
    </div>
  );
}
