import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { CctvManagerClient } from "@/components/admin/editors/cctv-manager-client";

export const metadata: Metadata = {
  title: "CCTV",
  robots: { index: false },
};

export default async function AdminCctvPage() {
  const session = await requireAdmin("camera:view");
  await initializeCmsStore();
  const [cameras, projects] = await Promise.all([
    list("cameras"),
    list("projects"),
  ]);

  return (
    <CctvManagerClient
      initialCameras={cameras}
      projects={projects.map((p) => ({ id: p.id, name: p.name }))}
      role={session.role}
    />
  );
}
