import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = { title: "Gallery", robots: { index: false } };

export default async function AdminGalleryPage() {
  await requireAdmin("project:read");
  await initializeCmsStore();
  const media = await list("media");
  const images = media.filter((m) => m.kind === "image" || m.kind === "diagram");

  return (
    <AdminCollectionList
      title="Gallery"
      description="Curated image assets for the public gallery experience."
      createHref="/admin/media-library"
      createLabel="Open media library"
      rows={images.map((m) => ({
        id: m.id,
        title: m.alt,
        subtitle: m.folder ?? m.storageKey,
        status: "published",
        meta: `${m.width}×${m.height}`,
      }))}
      emptyTitle="No gallery images"
      emptyDescription="Upload images in the media library to populate the gallery."
    />
  );
}
