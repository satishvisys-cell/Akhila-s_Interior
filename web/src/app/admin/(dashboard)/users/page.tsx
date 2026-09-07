import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = { title: "Users", robots: { index: false } };

export default async function AdminUsersPage() {
  await requireAdmin("user:manage");
  await initializeCmsStore();
  const users = await list("users");

  return (
    <AdminCollectionList
      title="Users"
      description="CMS operators and role assignments. Password hashes are never exposed."
      rows={users.map((u) => ({
        id: u.id,
        title: u.name,
        subtitle: `${u.email} · ${u.role}`,
        status: u.active ? "published" : "archived",
        meta: new Date(u.updatedAt).toLocaleDateString(),
      }))}
      emptyTitle="No users"
      emptyDescription="Seed creates a default super_admin account."
    />
  );
}
