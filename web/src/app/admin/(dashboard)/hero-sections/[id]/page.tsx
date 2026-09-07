import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getById, initializeCmsStore, list } from "@/lib/cms/store";
import { HeroBuilder } from "@/components/admin/editors/hero-builder";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  await initializeCmsStore();
  const hero = await getById("heroes", id);
  return {
    title: hero ? `Hero · ${hero.heading}` : "Hero",
    robots: { index: false },
  };
}

export default async function AdminHeroEditPage({ params }: PageProps) {
  const session = await requireAdmin("page:write");
  const { id } = await params;
  await initializeCmsStore();
  const [hero, media] = await Promise.all([
    getById("heroes", id),
    list("media"),
  ]);
  if (!hero) notFound();

  return <HeroBuilder hero={hero} media={media} role={session.role} />;
}
