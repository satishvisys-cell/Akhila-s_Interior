import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { EmptyState } from "@/components/ui/feedback";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = { title: "Team", robots: { index: false } };

export default async function AdminTeamPage() {
  await requireAdmin("page:write");

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb
        items={[{ href: "/admin", label: "Dashboard" }, { label: "Team" }]}
      />
      <div>
        <h1 className="font-display text-h2 text-text">Team</h1>
        <p className="mt-2 text-text-muted">
          Studio members shown on About and team blocks.
        </p>
      </div>
      <EmptyState
        title="No team members yet"
        description="Team member records will appear here once the team collection is added."
      />
    </div>
  );
}
