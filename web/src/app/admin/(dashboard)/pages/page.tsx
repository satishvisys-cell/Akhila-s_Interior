import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";
import { CreatePageButton } from "@/components/admin/editors/create-page-button";

export const metadata: Metadata = { title: "Pages", robots: { index: false } };

export default async function AdminPagesPage() {
  await requireAdmin("page:write");
  await initializeCmsStore();
  const pages = await list("pages");

  return (
    <AdminCollectionList
      title="Pages"
      description="Compose marketing and landing pages with the block builder."
      createLabel="New page"
      primaryAction={<CreatePageButton />}
      rows={pages.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: `/${p.slug}`,
        status: p.publishStatus,
        href: `/admin/pages/${p.id}/builder`,
        meta: new Date(p.updatedAt).toLocaleDateString(),
      }))}
      emptyTitle="No pages yet"
      emptyDescription="Create a page to open the block builder."
    />
  );
}
