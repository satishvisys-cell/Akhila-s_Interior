import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { initializeCmsStore, list } from "@/lib/cms/store";
import { AdminCollectionList } from "@/components/admin/admin-collection-list";

export const metadata: Metadata = { title: "Posts", robots: { index: false } };

export default async function AdminPostsPage() {
  await requireAdmin("page:write");
  await initializeCmsStore();
  const posts = await list("posts");

  return (
    <AdminCollectionList
      title="Posts"
      description="Journal and project update articles."
      rows={posts.map((p) => ({
        id: p.id,
        title: p.title,
        subtitle: `${p.category} · /${p.slug}`,
        status: p.publishStatus,
        meta: new Date(p.updatedAt).toLocaleDateString(),
      }))}
      emptyTitle="No posts yet"
      emptyDescription="Journal posts will appear here once authored."
    />
  );
}
