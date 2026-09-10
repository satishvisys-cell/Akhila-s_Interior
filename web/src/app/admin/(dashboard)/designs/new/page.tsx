import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { can } from "@/domain/permissions";
import { DesignEditor } from "@/components/admin/editors/design-editor";

export const metadata: Metadata = {
  title: "New design",
  robots: { index: false },
};

export default async function AdminNewDesignPage() {
  const session = await requireAdmin("media:write");
  return (
    <DesignEditor canWrite={can(session.role, "media:write")} />
  );
}
