import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getById, initializeCmsStore, list } from "@/lib/cms/store";
import { cn } from "@/lib/cn";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Hero Preview",
  robots: { index: false },
};

export default async function AdminHeroPreview({ params }: PageProps) {
  await requireAdmin("page:write");
  const { id } = await params;
  await initializeCmsStore();
  const [hero, media] = await Promise.all([
    getById("heroes", id),
    list("media"),
  ]);
  if (!hero) notFound();

  const asset = media.find((m) => m.id === hero.mediaId);
  const url = asset?.publicUrl ?? (asset ? `/media/${asset.storageKey}` : null);

  return (
    <div className="min-h-screen bg-bg">
      <p className="px-6 py-4 label-caps text-text-muted md:px-12">
        Hero preview
      </p>
      <section className="relative min-h-[70vh] overflow-hidden bg-graphite">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={asset?.alt ?? hero.heading}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div
          className="absolute inset-0 bg-graphite"
          style={{ opacity: hero.overlayStrength }}
          aria-hidden
        />
        <div
          className={cn(
            "relative z-10 flex min-h-[70vh] flex-col justify-end px-6 py-16 text-text-inverse md:px-12",
            hero.alignment === "center" && "items-center text-center",
            hero.alignment === "right" && "items-end text-right",
          )}
        >
          {hero.eyebrow ? (
            <p className="label-caps text-text-inverse/70">{hero.eyebrow}</p>
          ) : null}
          <h1 className="mt-3 font-display text-4xl md:text-6xl">
            {hero.heading}
          </h1>
          {hero.subtitle ? (
            <p className="mt-3 text-lg text-text-inverse/80">{hero.subtitle}</p>
          ) : null}
          {hero.description ? (
            <p className="mt-4 max-w-xl text-small text-text-inverse/70">
              {hero.description}
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
