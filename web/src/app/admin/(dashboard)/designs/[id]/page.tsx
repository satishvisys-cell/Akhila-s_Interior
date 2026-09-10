import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { can } from "@/domain/permissions";
import { getById, initializeCmsStore } from "@/lib/cms/store";
import { DesignEditor } from "@/components/admin/editors/design-editor";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit design",
  robots: { index: false },
};

export default async function AdminEditDesignPage({ params }: PageProps) {
  const session = await requireAdmin("media:write");
  const { id } = await params;
  await initializeCmsStore();
  const design = await getById("designs", id);
  if (!design) notFound();

  return (
    <DesignEditor
      design={design}
      canWrite={can(session.role, "media:write")}
    />
  );
}
