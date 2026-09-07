import { initializeCmsStore, list, getById, getBySlug } from "@/lib/cms/store";
import type { LiveSite, MediaAsset, Page, Post, Project } from "@/domain/types";

export async function getPublishedPageBySlug(slug: string): Promise<Page | null> {
  await initializeCmsStore();
  const page = await getBySlug("pages", slug);
  if (!page || page.publishStatus !== "published") return null;
  return page;
}

export async function getPublishedProjects(): Promise<Project[]> {
  await initializeCmsStore();
  const projects = await list("projects");
  return projects
    .filter((p) => p.publishStatus === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<Project | null> {
  await initializeCmsStore();
  const project = await getBySlug("projects", slug);
  if (!project || project.publishStatus !== "published") return null;
  return project;
}

export async function getMediaMap(): Promise<Map<string, MediaAsset>> {
  await initializeCmsStore();
  const media = await list("media");
  return new Map(media.map((m) => [m.id, m]));
}

export function mediaUrl(
  map: Map<string, MediaAsset>,
  id?: string | null,
): string | undefined {
  if (!id) return undefined;
  const asset = map.get(id);
  return asset?.publicUrl ?? asset?.derivatives?.desktop?.url ?? asset?.derivatives?.original?.url;
}

export async function getLiveSites(): Promise<LiveSite[]> {
  await initializeCmsStore();
  return list("liveSites");
}

export async function getLiveSiteBySlug(slug: string): Promise<LiveSite | null> {
  await initializeCmsStore();
  const sites = await list("liveSites");
  return sites.find((s) => s.slug === slug) ?? null;
}

export async function getPublishedPosts(): Promise<Post[]> {
  await initializeCmsStore();
  const posts = await list("posts");
  return posts
    .filter((p) => p.publishStatus === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime(),
    );
}

export async function getPublishedPostBySlug(
  slug: string,
): Promise<Post | null> {
  await initializeCmsStore();
  const post = await getBySlug("posts", slug);
  if (!post || post.publishStatus !== "published") return null;
  return post;
}

export async function getProjectCoverUrl(project: Project): Promise<string | undefined> {
  const map = await getMediaMap();
  return mediaUrl(map, project.coverMediaId);
}

export async function getMediaById(id: string): Promise<MediaAsset | null> {
  await initializeCmsStore();
  return getById("media", id);
}
