import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { NewProjectForm } from "@/components/admin/editors/new-project-form";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "New Project",
  robots: { index: false },
};

export default async function AdminNewProjectPage() {
  await requireAdmin("project:write");

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/projects", label: "Projects" },
          { label: "New" },
        ]}
      />
      <div>
        <h1 className="font-display text-h2 text-text">New project</h1>
        <p className="mt-2 text-text-muted">
          Create a draft project, then refine details in the editor.
        </p>
      </div>
      <NewProjectForm />
    </div>
  );
}
