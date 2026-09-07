import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { can } from "@/domain/permissions";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { NavigationEditor } from "@/components/admin/editors/navigation-editor";
import { EmptyState } from "@/components/ui/feedback";

export const metadata: Metadata = {
  title: "Navigation",
  robots: { index: false },
};

export default async function AdminNavigationPage() {
  const session = await requireAdmin();
  await initializeCmsStore();
  const settingsList = await list("settings");
  const settings = settingsList[0];
  const canWrite = can(session.role, "settings:write");

  if (!settings) {
    return (
      <EmptyState
        title="Settings missing"
        description="Site settings have not been seeded."
      />
    );
  }

  return <NavigationEditor settings={settings} canWrite={canWrite} />;
}
