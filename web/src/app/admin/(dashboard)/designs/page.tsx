import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = {
  title: "Designs",
  robots: { index: false },
};

export default async function AdminDesignsPage() {
  await requireAdmin("project:read");
  await initializeCmsStore();
  const designs = await list("designs");

  return (
    <AdminCollectionList
      title="Designs"
      description="Studio designs published to the public Designs gallery."
      createHref="/admin/designs/new"
      createLabel="New design"
      rows={designs
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((d) => ({
          id: d.id,
          title: d.title,
          subtitle: d.categories.join(" · ") || d.slug,
          status: d.publishStatus,
          href: `/admin/designs/${d.id}`,
          meta: d.coverMediaId,
        }))}
      emptyTitle="No designs yet"
      emptyDescription="Create a design and attach a media library image to publish it on /designs."
    />
  );
}
