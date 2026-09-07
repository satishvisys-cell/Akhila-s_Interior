import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { EmptyState } from "@/components/ui/feedback";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Diagrams",
  robots: { index: false },
};

export default async function AdminDiagramsPage() {
  await requireAdmin("project:read");

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[
          { href: "/admin", label: "Dashboard" },
          { label: "Diagrams" },
        ]}
      />
      <div>
        <h1 className="font-display text-h2 text-text">Diagrams</h1>
        <p className="mt-2 text-text-muted">
          Interactive exploded diagrams and labeled technical drawings.
        </p>
      </div>
      <EmptyState
        title="No diagrams collection yet"
        description="Diagram entities will appear here once the diagrams collection is added to the CMS store. You can still reference diagram IDs on projects."
      />
    </div>
  );
}
