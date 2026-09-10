import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { can } from "@/domain/permissions";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AboutEditor } from "@/components/admin/editors/about-editor";
import { EmptyState } from "@/components/ui/feedback";

export const metadata: Metadata = {
  title: "About",
  robots: { index: false },
};

export default async function AdminAboutPage() {
  const session = await requireAdmin("page:write");
  await initializeCmsStore();
  const about = (await list("about"))[0];

  if (!about) {
    return (
      <EmptyState
        title="About content missing"
        description="Seed the CMS or create about content."
      />
    );
  }

  return (
    <AboutEditor about={about} canWrite={can(session.role, "page:write")} />
  );
}
