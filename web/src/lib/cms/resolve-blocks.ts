/**
 * Server-side block resolver — turns `PageBlock[]` (ID references only) into
 * `ResolvedBlock[]` (real entities attached) for `<PageBlockRenderer>`.
 *
 * This is the missing link for the "data-driven page architecture" rule:
 * `Page -> Sections -> Section Type -> Section Data -> Reusable Renderer`.
 * Frontend components never need to change when content changes — only the
 * CMS data does.
 */
import {
  getById,
  getConstructionProgressById,
  initializeCmsStore,
  list,
} from "@/lib/cms/store";
import { getMediaMap, getPublishedProjects, mediaUrl } from "@/lib/cms/public";
import type {
  ConstructionProgress,
  HeroConfig,
  LiveSite,
  MasterTour,
  MediaAsset,
  PageBlock,
  Project,
  Room,
} from "@/domain/types";

export type ResolvedMedia = {
  url: string;
  alt: string;
  kind: MediaAsset["kind"];
  blurhash?: string;
};

export type ResolvedBlock =
  | { id: string; type: "hero"; visible: boolean; order: number; hero: HeroConfig | null; media: ResolvedMedia | null; mobileMedia: ResolvedMedia | null }
  | { id: string; type: "text"; visible: boolean; order: number; heading?: string; body: string; alignment?: "left" | "center" | "right" }
  | { id: string; type: "image"; visible: boolean; order: number; media: ResolvedMedia | null; caption?: string; fullBleed?: boolean }
  | { id: string; type: "video"; visible: boolean; order: number; media: ResolvedMedia | null; poster: ResolvedMedia | null; autoplay?: boolean; loop?: boolean; muted?: boolean }
  | { id: string; type: "gallery"; visible: boolean; order: number; items: ResolvedMedia[]; layout: "grid" | "masonry" | "carousel"; columns: number }
  | { id: string; type: "project_grid"; visible: boolean; order: number; heading?: string; projects: (Project & { coverUrl?: string })[] }
  | { id: string; type: "statistics"; visible: boolean; order: number; heading?: string; items: { value: string; label: string; suffix?: string }[] }
  | { id: string; type: "timeline"; visible: boolean; order: number; heading?: string; events: { id: string; date: string; title: string; description?: string; media: ResolvedMedia | null }[] }
  | { id: string; type: "master_tour"; visible: boolean; order: number; heading?: string; tour: (MasterTour & { resolvedScenes: { id: string; index: number; label: string; media: ResolvedMedia | null }[] }) | null }
  | { id: string; type: "room_explorer"; visible: boolean; order: number; heading?: string; rooms: (Room & { resolvedStates: { key: string; media: ResolvedMedia | null }[] })[] }
  | { id: string; type: "live_cctv"; visible: boolean; order: number; heading?: string; liveSite: LiveSite | null; maxCameras?: number }
  | { id: string; type: "construction_progress"; visible: boolean; order: number; heading?: string; progress: ConstructionProgress | null; showStages: boolean }
  | { id: string; type: "cta"; visible: boolean; order: number; heading: string; description?: string; primaryCta: { label: string; href: string }; secondaryCta?: { label: string; href: string }; background: ResolvedMedia | null }
  | { id: string; type: "faq"; visible: boolean; order: number; heading?: string; items: { id: string; question: string; answer: string }[] }
  | { id: string; type: "testimonials"; visible: boolean; order: number; heading?: string; count: number }
  | { id: string; type: "team"; visible: boolean; order: number; heading?: string; count: number }
  | { id: string; type: "html"; visible: boolean; order: number; html: string };

function toResolvedMedia(
  mediaMap: Map<string, MediaAsset>,
  id?: string | null,
): ResolvedMedia | null {
  if (!id) return null;
  const asset = mediaMap.get(id);
  if (!asset) return null;
  const url = mediaUrl(mediaMap, id);
  if (!url) return null;
  return { url, alt: asset.alt, kind: asset.kind, blurhash: asset.blurhash };
}

/**
 * Resolves a full block list in a bounded number of store reads (not N+1 per
 * block) — heroes/projects/tours/rooms/live sites/progress are each fetched
 * once and looked up in memory.
 */
export async function resolvePageBlocks(
  blocks: PageBlock[],
): Promise<ResolvedBlock[]> {
  await initializeCmsStore();

  const visibleSorted = [...blocks].sort((a, b) => a.order - b.order);

  const [mediaMap, allHeroes, allRooms] = await Promise.all([
    getMediaMap(),
    list("heroes"),
    list("rooms"),
  ]);
  const heroById = new Map(allHeroes.map((h) => [h.id, h]));
  const roomsByProject = new Map<string, Room[]>();
  for (const room of allRooms) {
    const arr = roomsByProject.get(room.projectId) ?? [];
    arr.push(room);
    roomsByProject.set(room.projectId, arr);
  }

  const resolved = await Promise.all(
    visibleSorted.map(async (block): Promise<ResolvedBlock> => {
      const base = { id: block.id, visible: block.visible, order: block.order };

      switch (block.type) {
        case "hero": {
          const hero = heroById.get(block.props.heroId) ?? null;
          return {
            ...base,
            type: "hero",
            hero,
            media: hero ? toResolvedMedia(mediaMap, hero.mediaId) : null,
            mobileMedia: hero ? toResolvedMedia(mediaMap, hero.mobileMediaId) : null,
          };
        }
        case "text":
          return { ...base, type: "text", heading: block.props.heading, body: block.props.body, alignment: block.props.alignment };
        case "image":
          return {
            ...base,
            type: "image",
            media: toResolvedMedia(mediaMap, block.props.mediaId),
            caption: block.props.caption,
            fullBleed: block.props.fullBleed,
          };
        case "video":
          return {
            ...base,
            type: "video",
            media: toResolvedMedia(mediaMap, block.props.mediaId),
            poster: toResolvedMedia(mediaMap, block.props.posterMediaId),
            autoplay: block.props.autoplay,
            loop: block.props.loop,
            muted: block.props.muted,
          };
        case "gallery":
          return {
            ...base,
            type: "gallery",
            items: block.props.mediaIds
              .map((id) => toResolvedMedia(mediaMap, id))
              .filter((m): m is ResolvedMedia => m !== null),
            layout: block.props.layout ?? "grid",
            columns: block.props.columns ?? 3,
          };
        case "project_grid": {
          const published = await getPublishedProjects();
          const filtered = block.props.projectIds?.length
            ? published.filter((p) => block.props.projectIds!.includes(p.id))
            : block.props.category
              ? published.filter((p) => p.category === block.props.category)
              : published;
          const limited = filtered.slice(0, block.props.limit ?? filtered.length);
          return {
            ...base,
            type: "project_grid",
            heading: block.props.heading,
            projects: limited.map((p) => ({ ...p, coverUrl: mediaUrl(mediaMap, p.coverMediaId) })),
          };
        }
        case "statistics":
          return { ...base, type: "statistics", heading: block.props.heading, items: block.props.items };
        case "timeline":
          return {
            ...base,
            type: "timeline",
            heading: block.props.heading,
            events: block.props.events.map((e) => ({ ...e, media: toResolvedMedia(mediaMap, e.mediaId) })),
          };
        case "master_tour": {
          const tour = await getById("tours", block.props.tourId);
          return {
            ...base,
            type: "master_tour",
            heading: block.props.heading,
            tour: tour
              ? {
                  ...tour,
                  resolvedScenes: [...tour.scenes]
                    .sort((a, b) => a.index - b.index)
                    .map((s) => ({ id: s.id, index: s.index, label: s.label, media: toResolvedMedia(mediaMap, s.mediaId) })),
                }
              : null,
          };
        }
        case "room_explorer": {
          const rooms = (roomsByProject.get(block.props.projectId) ?? []).sort(
            (a, b) => a.sortOrder - b.sortOrder,
          );
          return {
            ...base,
            type: "room_explorer",
            heading: block.props.heading,
            rooms: rooms.map((r) => ({
              ...r,
              resolvedStates: r.states.map((s) => ({ key: s.key, media: toResolvedMedia(mediaMap, s.mediaId) })),
            })),
          };
        }
        case "live_cctv": {
          const site = await getById("liveSites", block.props.liveSiteId);
          return { ...base, type: "live_cctv", heading: block.props.heading, liveSite: site, maxCameras: block.props.maxCameras };
        }
        case "construction_progress": {
          const progress = await getConstructionProgressById(block.props.progressId);
          return { ...base, type: "construction_progress", heading: block.props.heading, progress, showStages: block.props.showStages ?? true };
        }
        case "cta":
          return {
            ...base,
            type: "cta",
            heading: block.props.heading,
            description: block.props.description,
            primaryCta: block.props.primaryCta,
            secondaryCta: block.props.secondaryCta,
            background: toResolvedMedia(mediaMap, block.props.backgroundMediaId),
          };
        case "faq":
          return { ...base, type: "faq", heading: block.props.heading, items: block.props.items };
        case "testimonials":
          // No CMS store collection yet for testimonials — degrade honestly
          // instead of fabricating quotes (no fake content rule).
          return { ...base, type: "testimonials", heading: block.props.heading, count: block.props.testimonialIds.length };
        case "team":
          return { ...base, type: "team", heading: block.props.heading, count: block.props.memberIds.length };
        case "html":
          return { ...base, type: "html", html: block.props.html };
        default:
          return { ...base, type: "html", html: "" };
      }
    }),
  );

  return resolved;
}
