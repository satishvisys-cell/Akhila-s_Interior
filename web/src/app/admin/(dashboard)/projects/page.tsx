import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = { title: "Projects", robots: { index: false } };

export default async function AdminProjectsPage() {
  await requireAdmin("project:read");
  await initializeCmsStore();
  const projects = await list("projects");

  return (
    <AdminCollectionList
      title="Projects"
      description="Manage portfolio projects, publish status, and experiences."
      createLabel="New project"
      createHref="/admin/projects/new"
      rows={projects.map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.location} · ${p.category}`,
        status: p.publishStatus,
        href: `/admin/projects/${p.id}`,
        meta: new Date(p.updatedAt).toLocaleDateString(),
      }))}
      emptyTitle="No projects yet"
      emptyDescription="Create your first project to start building the portfolio."
    />
  );
}
