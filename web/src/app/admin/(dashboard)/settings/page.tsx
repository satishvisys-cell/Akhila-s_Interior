import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { can } from "@/domain/permissions";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { SettingsEditor } from "@/components/admin/editors/settings-editor";
import { EmptyState } from "@/components/ui/feedback";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false },
};

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  await initializeCmsStore();
  const settings = (await list("settings"))[0];

  if (!settings) {
    return (
      <EmptyState
        title="Settings missing"
        description="Site settings have not been seeded."
      />
    );
  }

  return (
    <SettingsEditor
      settings={settings}
      canWrite={can(session.role, "settings:write")}
    />
  );
}
