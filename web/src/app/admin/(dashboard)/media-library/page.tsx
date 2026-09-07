import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { can } from "@/domain/permissions";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { MediaLibraryClient } from "@/components/admin/editors/media-library-client";

export const metadata: Metadata = {
  title: "Media Library",
  robots: { index: false },
};

export default async function AdminMediaLibraryPage() {
  const session = await requireAdmin();
  await initializeCmsStore();
  const media = await list("media");

  return (
    <MediaLibraryClient
      initialMedia={media}
      canWrite={can(session.role, "media:write")}
    />
  );
}
