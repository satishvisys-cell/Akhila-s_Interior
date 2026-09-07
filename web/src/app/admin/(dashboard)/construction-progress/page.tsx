import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  initializeCmsStore,
  list,
  listConstructionProgress,
} from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = {
  title: "Construction Progress",
  robots: { index: false },
};

export default async function AdminConstructionProgressPage() {
  await requireAdmin("project:read");
  await initializeCmsStore();
  const [progress, projects] = await Promise.all([
    listConstructionProgress(),
    list("projects"),
  ]);
  const projectName = new Map(projects.map((p) => [p.id, p.name]));

  return (
    <AdminCollectionList
      title="Construction Progress"
      description="Stage-by-stage build tracking linked to projects."
      rows={progress.map((p) => ({
        id: p.id,
        title: projectName.get(p.projectId) ?? p.projectId,
        subtitle: `${p.stages.filter((s) => s.status === "complete").length}/${p.stages.length} stages complete`,
        status: p.percent >= 100 ? "published" : "draft",
        meta: `${p.percent}%`,
      }))}
      emptyTitle="No progress records"
      emptyDescription="Progress records are seeded with projects under construction."
    />
  );
}
