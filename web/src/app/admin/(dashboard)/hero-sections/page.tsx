import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = {
  title: "Hero Sections",
  robots: { index: false },
};

export default async function AdminHeroSectionsPage() {
  await requireAdmin("page:write");
  await initializeCmsStore();
  const heroes = await list("heroes");

  return (
    <AdminCollectionList
      title="Hero Sections"
      description="Cinematic hero configurations with live device preview."
      rows={heroes.map((h) => ({
        id: h.id,
        title: h.heading,
        subtitle: h.eyebrow ?? h.subtitle ?? "Hero",
        status: h.visibility === "public" ? "published" : "draft",
        href: `/admin/hero-sections/${h.id}`,
        meta: new Date(h.updatedAt).toLocaleDateString(),
      }))}
      emptyTitle="No hero sections"
      emptyDescription="Heroes are linked from pages. Seed data includes a home hero."
    />
  );
}
