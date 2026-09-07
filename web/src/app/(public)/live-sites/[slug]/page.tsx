import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { LiveCameraViewer } from "@/components/sections/live-camera-viewer";
import { getLiveSiteBySlug } from "@/lib/cms/public";
import { STITCH_V2 } from "@/lib/stitch/assets-v2";
import { InnerPageShell } from "@/components/layout/inner-page-shell";
import { EditorialCard } from "@/components/sections/editorial-card";

type PageProps = { params: Promise<{ slug: string }> };

const PREVIEW_CYCLE = [
  STITCH_V2.tour.entrance,
  STITCH_V2.live.cam2,
  STITCH_V2.live.cam3,
  STITCH_V2.live.cam4,
];

const CAM_LABELS = [
  { name: "Entrance", locationLabel: "Entrance" },
  { name: "North Wing", locationLabel: "North Wing" },
  { name: "Interior", locationLabel: "Interior" },
  { name: "Pool Deck", locationLabel: "Pool Deck" },
] as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getLiveSiteBySlug(slug);
  if (!site) return { title: "Live Site" };
  return {
    title: `Meridian Residence — Live`,
    description: `${site.stageLabel} · ${site.percent}% complete`,
  };
}

export default async function LiveSiteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const site = await getLiveSiteBySlug(slug);
  if (!site) notFound();

  const cameras =
    site.cameras.length > 0
      ? site.cameras.map((camera, i) => ({
          id: camera.id,
          name: CAM_LABELS[i % CAM_LABELS.length].name,
          locationLabel:
            camera.locationLabel || CAM_LABELS[i % CAM_LABELS.length].locationLabel,
          status: camera.status,
          previewImage: PREVIEW_CYCLE[i % PREVIEW_CYCLE.length],
        }))
      : CAM_LABELS.map((cam, i) => ({
          id: `cam-${i + 1}`,
          name: cam.name,
          locationLabel: cam.locationLabel,
          status: "live" as const,
          previewImage: PREVIEW_CYCLE[i],
        }));

  return (
    <InnerPageShell>
      <EditorialCard>
        <NextLink
          href="/live-sites"
          className="mb-6 inline-block text-sm font-semibold text-text-muted hover:text-ink-button"
        >
          ← All live sites
        </NextLink>
        <FadeUp>
          <LiveCameraViewer
            siteName="Meridian Residence"
            location={site.location || "Beverly Hills, CA"}
            stageLabel={site.stageLabel}
            percent={site.percent}
            cameras={cameras}
          />
        </FadeUp>
      </EditorialCard>
    </InnerPageShell>
  );
}
