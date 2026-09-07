import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getById, initializeCmsStore } from "@/lib/cms/store";
import { ProjectEditor } from "@/components/admin/editors/project-editor";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  await initializeCmsStore();
  const project = await getById("projects", id);
  return {
    title: project ? `Edit · ${project.name}` : "Project",
    robots: { index: false },
  };
}

export default async function AdminProjectEditPage({ params }: PageProps) {
  const session = await requireAdmin("project:read");
  const { id } = await params;
  await initializeCmsStore();
  const project = await getById("projects", id);
  if (!project) notFound();

  return <ProjectEditor project={project} role={session.role} />;
}
