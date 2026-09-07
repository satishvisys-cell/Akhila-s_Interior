import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = { title: "Videos", robots: { index: false } };

export default async function AdminVideosPage() {
  await requireAdmin("project:read");
  await initializeCmsStore();
  const media = await list("media");
  const videos = media.filter((m) => m.kind === "video");

  return (
    <AdminCollectionList
      title="Videos"
      description="Project films, progress reels, and cinematic cuts."
      createHref="/admin/media-library"
      createLabel="Upload video"
      rows={videos.map((m) => ({
        id: m.id,
        title: m.alt,
        subtitle: m.storageKey,
        status: "published",
        meta: m.durationMs
          ? `${Math.round(m.durationMs / 1000)}s`
          : new Date(m.updatedAt).toLocaleDateString(),
      }))}
      emptyTitle="No videos yet"
      emptyDescription="Upload MP4 or WebM files via the media library."
    />
  );
}
