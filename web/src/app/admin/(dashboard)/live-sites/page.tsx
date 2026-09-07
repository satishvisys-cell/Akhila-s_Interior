import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = {
  title: "Live Sites",
  robots: { index: false },
};

export default async function AdminLiveSitesPage() {
  await requireAdmin("camera:view");
  await initializeCmsStore();
  const sites = await list("liveSites");

  return (
    <AdminCollectionList
      title="Live Sites"
      description="Active construction sites with public or private camera feeds."
      rows={sites.map((s) => ({
        id: s.id,
        title: s.slug,
        subtitle: `${s.location} · ${s.stageLabel}`,
        status: s.visibility === "public" ? "live" : "offline",
        meta: `${s.percent}% · ${s.cameras.length} cameras`,
      }))}
      emptyTitle="No live sites"
      emptyDescription="Link a live site from a project under construction."
    />
  );
}
