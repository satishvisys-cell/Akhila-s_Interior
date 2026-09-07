import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getById, initializeCmsStore } from "@/lib/cms/store";
import { PageBuilder } from "@/components/admin/editors/page-builder";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  await initializeCmsStore();
  const page = await getById("pages", id);
  return {
    title: page ? `Builder · ${page.title}` : "Page Builder",
    robots: { index: false },
  };
}

export default async function AdminPageBuilderPage({ params }: PageProps) {
  const session = await requireAdmin("page:write");
  const { id } = await params;
  await initializeCmsStore();
  const page = await getById("pages", id);
  if (!page) notFound();

  return <PageBuilder page={page} role={session.role} />;
}
