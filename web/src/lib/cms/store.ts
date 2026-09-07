import {
  access,
  mkdir,
  open,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { hashPassword } from "@/lib/auth/password";
import type {
  Camera,
  CameraSecretsMap,
  CameraStreamSecret,
  ConstructionProgress,
  HeroConfig,
  LiveSite,
  MasterTour,
  MediaAsset,
  Page,
  Post,
  Project,
  Room,
  SiteSettings,
  User,
  UserRecord,
} from "@/domain/types";

// ---------------------------------------------------------------------------
// Collection registry
// ---------------------------------------------------------------------------

export type CollectionName =
  | "projects"
  | "pages"
  | "heroes"
  | "media"
  | "cameras"
  | "liveSites"
  | "posts"
  | "tours"
  | "rooms"
  | "users"
  | "settings";

type CollectionMap = {
  projects: Project;
  pages: Page;
  heroes: HeroConfig;
  media: MediaAsset;
  cameras: Camera;
  liveSites: LiveSite;
  posts: Post;
  tours: MasterTour;
  rooms: Room;
  users: UserRecord;
  settings: SiteSettings;
};

type Sluggable = { slug: string };
type Sortable = { sortOrder: number };

const COLLECTIONS: CollectionName[] = [
  "projects",
  "pages",
  "heroes",
  "media",
  "cameras",
  "liveSites",
  "posts",
  "tours",
  "rooms",
  "users",
  "settings",
];

const CAMERA_SECRETS_FILE = "camera-secrets.json";
const PROGRESS_FILE = "construction-progress.json";
const SEED_MARKER_FILE = ".seeded";
const SEED_LOCK_FILE = ".seed.lock";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/**
 * Local: `data/cms` under the Next app (gitignored).
 * Vercel / serverless: `/tmp/akhila-cms` — the only reliably writable path
 * during build + lambda cold starts. Override with `CMS_DATA_DIR`.
 */
export function getCmsDataDir(): string {
  if (process.env.CMS_DATA_DIR) return process.env.CMS_DATA_DIR;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "akhila-cms");
  }
  return path.join(process.cwd(), "data", "cms");
}

function collectionPath(name: CollectionName): string {
  return path.join(getCmsDataDir(), `${name}.json`);
}

function cameraSecretsPath(): string {
  return path.join(getCmsDataDir(), CAMERA_SECRETS_FILE);
}

function seedMarkerPath(): string {
  return path.join(getCmsDataDir(), SEED_MARKER_FILE);
}

function seedLockPath(): string {
  return path.join(getCmsDataDir(), SEED_LOCK_FILE);
}

function progressPath(): string {
  return path.join(getCmsDataDir(), PROGRESS_FILE);
}

async function ensureDataDir(): Promise<void> {
  await mkdir(getCmsDataDir(), { recursive: true });
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Exclusive create lock so parallel Next.js build workers don't race
 * seeding the same JSON files (ENOENT on rename under contention).
 */
async function withSeedLock(fn: () => Promise<void>): Promise<void> {
  await ensureDataDir();
  const lockPath = seedLockPath();

  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      const handle = await open(lockPath, "wx");
      try {
        await fn();
      } finally {
        await handle.close().catch(() => undefined);
        await unlink(lockPath).catch(() => undefined);
      }
      return;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "EEXIST") {
        if (await fileExists(seedMarkerPath())) return;
        await sleep(50 + Math.floor(Math.random() * 50));
        continue;
      }
      throw err;
    }
  }

  // Last resort: another worker may have finished while we waited.
  if (await fileExists(seedMarkerPath())) return;
  throw new Error("[cms/store] Timed out waiting for CMS seed lock");
}

// ---------------------------------------------------------------------------
// Low-level I/O
// ---------------------------------------------------------------------------

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return fallback;
    }
    throw err;
  }
}

async function writeJsonFileAtomic<T>(filePath: string, data: T): Promise<void> {
  const payload = JSON.stringify(data, null, 2);
  const dir = path.dirname(filePath);
  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt++) {
    await ensureDataDir();
    const tmp = path.join(
      dir,
      `.${path.basename(filePath)}.${process.pid}.${Date.now()}.${attempt}.${nanoid(6)}.tmp`,
    );
    try {
      await writeFile(tmp, payload, "utf8");
      await rename(tmp, filePath);
      return;
    } catch (err) {
      lastError = err;
      await unlink(tmp).catch(() => undefined);
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT" || code === "EEXIST" || code === "EBUSY") {
        await sleep(20 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`[cms/store] Failed to write ${filePath}`);
}

async function readCollection<T>(name: CollectionName): Promise<T[]> {
  return readJsonFile<T[]>(collectionPath(name), []);
}

async function writeCollection<T>(name: CollectionName, items: T[]): Promise<void> {
  await writeJsonFileAtomic(collectionPath(name), items);
}

// ---------------------------------------------------------------------------
// Camera credential isolation
// ---------------------------------------------------------------------------

export async function getCameraSecrets(): Promise<CameraSecretsMap> {
  return readJsonFile<CameraSecretsMap>(cameraSecretsPath(), {});
}

export async function getCameraSecret(
  streamSourceId: string,
): Promise<CameraStreamSecret | null> {
  const secrets = await getCameraSecrets();
  return secrets[streamSourceId] ?? null;
}

export async function setCameraSecret(
  streamSourceId: string,
  secret: CameraStreamSecret,
): Promise<void> {
  const secrets = await getCameraSecrets();
  secrets[streamSourceId] = secret;
  await writeJsonFileAtomic(cameraSecretsPath(), secrets);
}

export async function removeCameraSecret(streamSourceId: string): Promise<void> {
  const secrets = await getCameraSecrets();
  delete secrets[streamSourceId];
  await writeJsonFileAtomic(cameraSecretsPath(), secrets);
}

function sanitizeCamera(camera: Camera): Camera {
  const { streamSourceId, ...rest } = camera;
  return { ...rest, streamSourceId };
}

function sanitizeCamerasInLiveSite(site: LiveSite): LiveSite {
  return {
    ...site,
    cameras: site.cameras.map(sanitizeCamera),
  };
}

// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------

export async function list<T extends CollectionName>(
  collection: T,
): Promise<CollectionMap[T][]> {
  const items = await readCollection<CollectionMap[T]>(collection);

  if (collection === "cameras") {
    return items.map((item) => sanitizeCamera(item as Camera)) as CollectionMap[T][];
  }
  if (collection === "liveSites") {
    return items.map((item) =>
      sanitizeCamerasInLiveSite(item as LiveSite),
    ) as CollectionMap[T][];
  }
  if (collection === "users") {
    return items.map((item) => toPublicUser(item as UserRecord)) as CollectionMap[T][];
  }

  return items;
}

export async function getById<T extends CollectionName>(
  collection: T,
  id: string,
): Promise<CollectionMap[T] | null> {
  const items = await readCollection<CollectionMap[T]>(collection);
  const found = items.find((item) => item.id === id);
  if (!found) return null;

  if (collection === "cameras") {
    return sanitizeCamera(found as Camera) as CollectionMap[T];
  }
  if (collection === "liveSites") {
    return sanitizeCamerasInLiveSite(found as LiveSite) as CollectionMap[T];
  }
  if (collection === "users") {
    return toPublicUser(found as UserRecord) as CollectionMap[T];
  }

  return found;
}

export async function getBySlug<T extends CollectionName>(
  collection: T,
  slug: string,
): Promise<CollectionMap[T] | null> {
  const items = await readCollection<CollectionMap[T] & Sluggable>(collection);
  const found = items.find((item) => item.slug === slug);
  if (!found) return null;

  if (collection === "liveSites") {
    return sanitizeCamerasInLiveSite(found as LiveSite) as CollectionMap[T];
  }
  if (collection === "users") {
    return toPublicUser(found as UserRecord) as CollectionMap[T];
  }

  return found as CollectionMap[T];
}

export async function create<T extends CollectionName>(
  collection: T,
  item: Omit<CollectionMap[T], "id" | "createdAt" | "updatedAt"> & {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
  },
): Promise<CollectionMap[T]> {
  const items = await readCollection<CollectionMap[T]>(collection);
  const now = new Date().toISOString();

  const record = {
    ...item,
    id: item.id ?? nanoid(),
    createdAt: (item as { createdAt?: string }).createdAt ?? now,
    updatedAt: now,
  } as CollectionMap[T];

  items.push(record);
  await writeCollection(collection, items);

  return sanitizeOnRead(collection, record);
}

export async function update<T extends CollectionName>(
  collection: T,
  id: string,
  patch: Partial<CollectionMap[T]>,
): Promise<CollectionMap[T] | null> {
  const items = await readCollection<CollectionMap[T]>(collection);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated = {
    ...items[index],
    ...patch,
    id,
    updatedAt: new Date().toISOString(),
  } as CollectionMap[T];

  items[index] = updated;
  await writeCollection(collection, items);

  return sanitizeOnRead(collection, updated);
}

export async function remove<T extends CollectionName>(
  collection: T,
  id: string,
): Promise<boolean> {
  const items = await readCollection<CollectionMap[T]>(collection);
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;

  await writeCollection(collection, next);
  return true;
}

export async function reorder<T extends CollectionName>(
  collection: T,
  orderedIds: string[],
): Promise<CollectionMap[T][]> {
  const items = await readCollection<CollectionMap[T] & Sortable>(collection);
  const byId = new Map(items.map((item) => [item.id, item]));

  const reordered: (CollectionMap[T] & Sortable)[] = [];
  orderedIds.forEach((id, index) => {
    const item = byId.get(id);
    if (item) {
      reordered.push({ ...item, sortOrder: index });
      byId.delete(id);
    }
  });

  for (const remaining of byId.values()) {
    reordered.push({
      ...remaining,
      sortOrder: reordered.length,
    });
  }

  await writeCollection(collection, reordered as CollectionMap[T][]);
  return list(collection);
}

// ---------------------------------------------------------------------------
// User helpers (server-only password access)
// ---------------------------------------------------------------------------

export function toPublicUser(record: UserRecord): User {
  // passwordHash must never leave the server
  const user: Partial<UserRecord> = { ...record };
  delete user.passwordHash;
  return user as User;
}

export async function getUserRecordByEmail(
  email: string,
): Promise<UserRecord | null> {
  const items = await readCollection<UserRecord>("users");
  return items.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserRecordById(id: string): Promise<UserRecord | null> {
  const items = await readCollection<UserRecord>("users");
  return items.find((u) => u.id === id) ?? null;
}

function sanitizeOnRead<T extends CollectionName>(
  collection: T,
  item: CollectionMap[T],
): CollectionMap[T] {
  if (collection === "cameras") {
    return sanitizeCamera(item as Camera) as CollectionMap[T];
  }
  if (collection === "liveSites") {
    return sanitizeCamerasInLiveSite(item as LiveSite) as CollectionMap[T];
  }
  if (collection === "users") {
    return toPublicUser(item as UserRecord) as CollectionMap[T];
  }
  return item;
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const now = () => new Date().toISOString();

function makeMedia(
  partial: Pick<MediaAsset, "id" | "alt" | "storageKey"> &
    Partial<MediaAsset>,
): MediaAsset {
  const baseUrl = `/media/${partial.storageKey}`;
  const width = partial.width ?? 2400;
  const height = partial.height ?? 1600;

  return {
    id: partial.id,
    kind: partial.kind ?? "image",
    storageKey: partial.storageKey,
    publicUrl: partial.publicUrl ?? baseUrl,
    width,
    height,
    durationMs: partial.durationMs,
    alt: partial.alt,
    blurhash: partial.blurhash ?? "LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
    tags: partial.tags ?? [],
    folder: partial.folder ?? "projects",
    metadata: partial.metadata ?? {},
    derivatives: partial.derivatives ?? {
      thumb: {
        key: "thumb",
        url: `${baseUrl}?w=400`,
        width: 400,
        height: Math.round(height * (400 / width)),
        mimeType: "image/webp",
        sizeBytes: 28000,
      },
      mobile: {
        key: "mobile",
        url: `${baseUrl}?w=768`,
        width: 768,
        height: Math.round(height * (768 / width)),
        mimeType: "image/webp",
        sizeBytes: 95000,
      },
      tablet: {
        key: "tablet",
        url: `${baseUrl}?w=1280`,
        width: 1280,
        height: Math.round(height * (1280 / width)),
        mimeType: "image/webp",
        sizeBytes: 180000,
      },
      desktop: {
        key: "desktop",
        url: `${baseUrl}?w=1920`,
        width: 1920,
        height: Math.round(height * (1920 / width)),
        mimeType: "image/webp",
        sizeBytes: 320000,
      },
      original: {
        key: "original",
        url: baseUrl,
        width,
        height,
        mimeType: "image/jpeg",
        sizeBytes: 1200000,
      },
    },
    createdAt: partial.createdAt ?? now(),
    updatedAt: partial.updatedAt ?? now(),
  };
}

async function buildSeedData(): Promise<{
  media: MediaAsset[];
  projects: Project[];
  heroes: HeroConfig[];
  pages: Page[];
  tours: MasterTour[];
  rooms: Room[];
  liveSites: LiveSite[];
  cameras: Camera[];
  posts: Post[];
  users: UserRecord[];
  settings: SiteSettings[];
  progress: ConstructionProgress[];
  cameraSecrets: CameraSecretsMap;
}> {
  const ts = now();

  const mediaMeridianHero = makeMedia({
    id: "med-hero-001",
    alt: "Meridian Residence — axonometric hero at dusk",
    storageKey: "meridian/hero-axonometric.jpg",
    tags: ["meridian", "hero", "residential"],
  });

  const mediaSkylineHero = makeMedia({
    id: "sky-hero-001",
    alt: "Skyline Villa — construction progress aerial",
    storageKey: "skyline/hero-aerial.jpg",
    tags: ["skyline", "hero", "construction"],
  });

  const mediaHomeHero = makeMedia({
    id: "home-hero-001",
    alt: "Akhila Interiors — cinematic entrance",
    storageKey: "site/home-hero.jpg",
    folder: "site",
    tags: ["home", "hero"],
  });

  const mediaMeridianLiving = makeMedia({
    id: "med-scene-02",
    alt: "Meridian Residence — living room",
    storageKey: "meridian/tour-living-room.jpg",
    tags: ["meridian", "tour"],
  });

  const mediaMeridianKitchen = makeMedia({
    id: "med-scene-03",
    alt: "Meridian Residence — kitchen",
    storageKey: "meridian/tour-kitchen.jpg",
    tags: ["meridian", "tour"],
  });

  const mediaMeridianEntrance = makeMedia({
    id: "med-scene-01",
    alt: "Meridian Residence — entrance",
    storageKey: "meridian/tour-entrance.jpg",
    tags: ["meridian", "tour"],
  });

  const mediaMeridianStairs = makeMedia({
    id: "med-scene-04",
    alt: "Meridian Residence — stairs",
    storageKey: "meridian/tour-stairs.jpg",
    tags: ["meridian", "tour"],
  });

  const mediaMeridianHall = makeMedia({
    id: "med-scene-05",
    alt: "Meridian Residence — hall",
    storageKey: "meridian/tour-hall.jpg",
    tags: ["meridian", "tour"],
  });

  const mediaMeridianBedroom = makeMedia({
    id: "med-scene-06",
    alt: "Meridian Residence — master bedroom",
    storageKey: "meridian/tour-bedroom.jpg",
    tags: ["meridian", "tour"],
  });

  const mediaMeridianBathroom = makeMedia({
    id: "med-scene-07",
    alt: "Meridian Residence — bathroom",
    storageKey: "meridian/tour-bathroom.jpg",
    tags: ["meridian", "tour"],
  });

  const media = [
    mediaMeridianHero,
    mediaSkylineHero,
    mediaHomeHero,
    mediaMeridianEntrance,
    mediaMeridianLiving,
    mediaMeridianKitchen,
    mediaMeridianStairs,
    mediaMeridianHall,
    mediaMeridianBedroom,
    mediaMeridianBathroom,
  ];

  const meridianTourId = "tour-meridian-001";
  const meridianProgressId = "progress-meridian-001";
  const skylineLiveSiteId = "live-skyline-001";

  const meridianRoomLiving: Room = {
    id: "room-med-living",
    projectId: "proj-meridian-001",
    slug: "living-room",
    name: "Living Room",
    areaSqm: 48,
    heightM: 3.2,
    materials: ["oak flooring", "limestone accent", "brass hardware"],
    sortOrder: 1,
    states: [
      { key: "assembled", mediaId: mediaMeridianLiving.id },
      { key: "final", mediaId: mediaMeridianLiving.id, labelOverlay: "FINAL" },
    ],
    createdAt: ts,
    updatedAt: ts,
  };

  const meridianRoomKitchen: Room = {
    id: "room-med-kitchen",
    projectId: "proj-meridian-001",
    slug: "kitchen",
    name: "Kitchen",
    areaSqm: 22,
    heightM: 3.0,
    materials: ["marble countertop", "matte lacquer", "smoked glass"],
    sortOrder: 2,
    states: [
      { key: "assembled", mediaId: mediaMeridianKitchen.id },
      { key: "final", mediaId: mediaMeridianKitchen.id },
    ],
    createdAt: ts,
    updatedAt: ts,
  };

  const rooms = [meridianRoomLiving, meridianRoomKitchen];

  const meridianTour: MasterTour = {
    id: meridianTourId,
    projectId: "proj-meridian-001",
    title: "Meridian Residence — Cinematic Tour",
    scenes: [
      {
        id: "scene-01",
        index: 1,
        label: "Entrance",
        mediaId: mediaMeridianEntrance.id,
        thumbnailMediaId: mediaMeridianEntrance.id,
        durationHintMs: 4000,
      },
      {
        id: "scene-02",
        index: 2,
        label: "Living Room",
        mediaId: mediaMeridianLiving.id,
        thumbnailMediaId: mediaMeridianLiving.id,
        durationHintMs: 5000,
      },
      {
        id: "scene-03",
        index: 3,
        label: "Kitchen",
        mediaId: mediaMeridianKitchen.id,
        thumbnailMediaId: mediaMeridianKitchen.id,
        durationHintMs: 4500,
      },
      {
        id: "scene-04",
        index: 4,
        label: "Stairs",
        mediaId: mediaMeridianStairs.id,
        thumbnailMediaId: mediaMeridianStairs.id,
        durationHintMs: 3500,
      },
      {
        id: "scene-05",
        index: 5,
        label: "Hall",
        mediaId: mediaMeridianHall.id,
        thumbnailMediaId: mediaMeridianHall.id,
        durationHintMs: 3000,
      },
      {
        id: "scene-06",
        index: 6,
        label: "Master Bedroom",
        mediaId: mediaMeridianBedroom.id,
        thumbnailMediaId: mediaMeridianBedroom.id,
        durationHintMs: 5000,
      },
      {
        id: "scene-07",
        index: 7,
        label: "Bathroom",
        mediaId: mediaMeridianBathroom.id,
        thumbnailMediaId: mediaMeridianBathroom.id,
        durationHintMs: 4000,
      },
    ],
    createdAt: ts,
    updatedAt: ts,
  };

  const meridianProgress: ConstructionProgress = {
    id: meridianProgressId,
    projectId: "proj-meridian-001",
    percent: 100,
    stages: [
      { key: "planning", status: "complete", percent: 100, mediaIds: [], completedAt: ts },
      { key: "foundation", status: "complete", percent: 100, mediaIds: [], completedAt: ts },
      { key: "structure", status: "complete", percent: 100, mediaIds: [], completedAt: ts },
      { key: "finishes", status: "complete", percent: 100, mediaIds: [mediaMeridianHero.id], completedAt: ts },
      { key: "handover", status: "complete", percent: 100, mediaIds: [], completedAt: ts },
    ],
    createdAt: ts,
    updatedAt: ts,
  };

  const skylineStreamSourceId = "cam-src-skyline-north";
  const skylineCamera: Camera = {
    id: "cam-skyline-01",
    name: "Camera 01 — North Elevation",
    locationLabel: "North Elevation",
    status: "live",
    visibility: "public",
    sortOrder: 0,
    streamSourceId: skylineStreamSourceId,
    lastSeenAt: ts,
  };

  const skylineLiveSite: LiveSite = {
    id: skylineLiveSiteId,
    projectId: "proj-skyline-001",
    slug: "skyline-villa",
    location: "Bengaluru, Karnataka",
    stageLabel: "Structure & MEP",
    percent: 62,
    visibility: "public",
    cameras: [skylineCamera],
    createdAt: ts,
    updatedAt: ts,
  };

  const meridianProject: Project = {
    id: "proj-meridian-001",
    slug: "meridian-residence",
    name: "Meridian Residence",
    location: "Hyderabad, Telangana",
    category: "residential",
    year: 2025,
    areaSqm: 680,
    status: "completed",
    description:
      "A cinematic residential narrative balancing warm materiality with precise spatial geometry. Meridian Residence unfolds through a canonical room sequence — entrance to bathroom — with exploded diagrams and material exploration.",
    coverMediaId: mediaMeridianHero.id,
    seoTitle: "Meridian Residence — Akhila Interiors",
    seoDescription:
      "Explore the completed Meridian Residence: master tour, room explorer, materials, and construction story.",
    seo: {
      title: "Meridian Residence",
      description: "Premium residential interiors by Akhila.",
      ogImageMediaId: mediaMeridianHero.id,
    },
    publishStatus: "published",
    publishedAt: ts,
    sortOrder: 0,
    galleryMediaIds: [
      mediaMeridianEntrance.id,
      mediaMeridianLiving.id,
      mediaMeridianKitchen.id,
      mediaMeridianBedroom.id,
    ],
    videoMediaIds: [],
    materials: [
      { id: "mat-001", name: "European Oak", finish: "matte", colorHex: "#C4A882" },
      { id: "mat-002", name: "Calacatta Marble", finish: "honed", mediaId: mediaMeridianKitchen.id },
    ],
    diagramIds: [],
    roomIds: [meridianRoomLiving.id, meridianRoomKitchen.id],
    tourId: meridianTourId,
    progressId: meridianProgressId,
    liveSiteId: undefined,
    updates: [
      {
        id: "upd-001",
        title: "Handover complete",
        body: "Meridian Residence has been handed over to the client.",
        mediaIds: [mediaMeridianHero.id],
        publishedAt: ts,
      },
    ],
    createdAt: ts,
    updatedAt: ts,
  };

  const skylineProject: Project = {
    id: "proj-skyline-001",
    slug: "skyline-villa",
    name: "Skyline Villa",
    location: "Bengaluru, Karnataka",
    category: "residential",
    year: 2026,
    areaSqm: 920,
    status: "in_progress",
    description:
      "Skyline Villa is an active construction site with live CCTV monitoring, progress tracking, and staged interior planning. Follow the build from structure through finishes.",
    coverMediaId: mediaSkylineHero.id,
    seoTitle: "Skyline Villa — Live Construction",
    seoDescription:
      "Watch Skyline Villa come to life with live site cameras and construction progress updates.",
    seo: {
      title: "Skyline Villa",
      description: "Live construction monitoring and premium villa design.",
      ogImageMediaId: mediaSkylineHero.id,
    },
    publishStatus: "published",
    publishedAt: ts,
    sortOrder: 1,
    galleryMediaIds: [mediaSkylineHero.id],
    videoMediaIds: [],
    materials: [],
    diagramIds: [],
    roomIds: [],
    tourId: undefined,
    progressId: undefined,
    liveSiteId: skylineLiveSiteId,
    updates: [],
    createdAt: ts,
    updatedAt: ts,
  };

  const homeHero: HeroConfig = {
    id: "hero-home-001",
    pageId: "page-home-001",
    mediaId: mediaHomeHero.id,
    mobileMediaId: mediaHomeHero.id,
    eyebrow: "Interior Design",
    heading: "Spaces shaped with intention",
    subtitle: "Akhila Interiors",
    description:
      "Premium residential and commercial interiors — from concept through construction to cinematic reveal.",
    primaryCta: { label: "View Projects", href: "/projects", variant: "primary" },
    secondaryCta: { label: "Live Sites", href: "/live-sites", variant: "secondary" },
    overlayStrength: 0.45,
    alignment: "left",
    animation: "fade_up",
    visibility: "public",
    sortOrder: 0,
    createdAt: ts,
    updatedAt: ts,
  };

  const homePage: Page = {
    id: "page-home-001",
    slug: "home",
    title: "Home",
    publishStatus: "published",
    seo: {
      title: "Akhila Interiors",
      description: "Premium interior design and live fit-out experiences.",
      ogImageMediaId: mediaHomeHero.id,
    },
    blocks: [
      {
        id: "block-hero-001",
        type: "hero",
        order: 0,
        visible: true,
        props: { heroId: homeHero.id },
      },
      {
        id: "block-projects-001",
        type: "project_grid",
        order: 1,
        visible: true,
        props: {
          heading: "Featured Projects",
          limit: 4,
        },
      },
    ],
    publishedAt: ts,
    createdAt: ts,
    updatedAt: ts,
  };

  const adminPasswordHash = await hashPassword("Admin!ChangeMe1");

  const adminUser: UserRecord = {
    id: "user-admin-001",
    email: "admin@akhila.com",
    name: "Akhila Admin",
    role: "super_admin",
    active: true,
    passwordHash: adminPasswordHash,
    createdAt: ts,
    updatedAt: ts,
  };

  const settings: SiteSettings = {
    id: "settings-001",
    siteName: "Akhila Interiors",
    tagline: "Interior design with cinematic precision",
    primaryNav: [
      { id: "nav-1", label: "Projects", href: "/projects", sortOrder: 0, visible: true },
      { id: "nav-2", label: "Live Sites", href: "/live-sites", sortOrder: 1, visible: true },
      { id: "nav-3", label: "Gallery", href: "/gallery", sortOrder: 2, visible: true },
      { id: "nav-4", label: "About", href: "/about", sortOrder: 3, visible: true },
      { id: "nav-5", label: "Contact", href: "/contact", sortOrder: 4, visible: true },
    ],
    footerNav: [
      { id: "fnav-1", label: "Privacy", href: "/privacy", sortOrder: 0, visible: true },
      { id: "fnav-2", label: "Terms", href: "/terms", sortOrder: 1, visible: true },
    ],
    contactEmail: "hello@akhila.com",
    socialLinks: {
      instagram: "https://instagram.com/akhilainteriors",
      linkedin: "https://linkedin.com/company/akhilainteriors",
    },
    defaultSeo: {
      title: "Akhila Interiors",
      description: "Premium interior design studio.",
    },
    createdAt: ts,
    updatedAt: ts,
  };

  const cameraSecrets: CameraSecretsMap = {
    [skylineStreamSourceId]: {
      rtspUrl: "rtsp://internal.example/skyline/north",
      username: "cctv_user",
      password: "REPLACE_IN_PRODUCTION",
      hlsProxyUrl: "https://stream.internal.example/skyline/north/index.m3u8",
      notes: "Server-only — never expose to client",
    },
  };

  const skylineProgress: ConstructionProgress = {
    id: "progress-skyline-001",
    projectId: "proj-skyline-001",
    percent: 62,
    stages: [
      { key: "planning", status: "complete", percent: 100, mediaIds: [], completedAt: ts },
      { key: "foundation", status: "complete", percent: 100, mediaIds: [], completedAt: ts },
      { key: "structure", status: "active", percent: 75, mediaIds: [mediaSkylineHero.id] },
      { key: "mep", status: "pending", percent: 0, mediaIds: [] },
      { key: "finishes", status: "pending", percent: 0, mediaIds: [] },
    ],
    createdAt: ts,
    updatedAt: ts,
  };

  skylineProject.progressId = skylineProgress.id;

  return {
    media,
    projects: [meridianProject, skylineProject],
    heroes: [homeHero],
    pages: [homePage],
    tours: [meridianTour],
    rooms,
    liveSites: [skylineLiveSite],
    cameras: [skylineCamera],
    posts: [],
    users: [adminUser],
    settings: [settings],
    progress: [meridianProgress, skylineProgress],
    cameraSecrets,
  };
}

export async function seedCmsData(force = false): Promise<void> {
  await withSeedLock(async () => {
    await ensureDataDir();

    const markerExists = await fileExists(seedMarkerPath());
    if (markerExists && !force) {
      return;
    }

    const seed = await buildSeedData();

    await writeCollection("media", seed.media);
    await writeCollection("projects", seed.projects);
    await writeCollection("heroes", seed.heroes);
    await writeCollection("pages", seed.pages);
    await writeCollection("tours", seed.tours);
    await writeCollection("rooms", seed.rooms);
    await writeCollection("liveSites", seed.liveSites);
    await writeCollection("cameras", seed.cameras);
    await writeCollection("posts", seed.posts);
    await writeCollection("users", seed.users);
    await writeCollection("settings", seed.settings);
    await writeJsonFileAtomic(progressPath(), seed.progress);
    await writeJsonFileAtomic(cameraSecretsPath(), seed.cameraSecrets);

    await writeFile(
      seedMarkerPath(),
      JSON.stringify({ seededAt: now(), version: 1 }, null, 2),
      "utf8",
    );
  });
}

// ---------------------------------------------------------------------------
// Initialization (deduplicated — safe to call multiple times)
// ---------------------------------------------------------------------------

let initPromise: Promise<void> | null = null;

export function initializeCmsStore(): Promise<void> {
  if (!initPromise) {
    initPromise = doInitializeCmsStore().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

async function doInitializeCmsStore(): Promise<void> {
  await withSeedLock(async () => {
    await ensureDataDir();

    for (const name of COLLECTIONS) {
      const filePath = collectionPath(name);
      if (!(await fileExists(filePath))) {
        await writeCollection(name, []);
      }
    }

    if (!(await fileExists(cameraSecretsPath()))) {
      await writeJsonFileAtomic(cameraSecretsPath(), {});
    }

    if (!(await fileExists(progressPath()))) {
      await writeJsonFileAtomic(progressPath(), []);
    }

    // Inline seed while holding the same lock (avoid nested lock deadlock).
    const markerExists = await fileExists(seedMarkerPath());
    if (!markerExists) {
      const seed = await buildSeedData();
      await writeCollection("media", seed.media);
      await writeCollection("projects", seed.projects);
      await writeCollection("heroes", seed.heroes);
      await writeCollection("pages", seed.pages);
      await writeCollection("tours", seed.tours);
      await writeCollection("rooms", seed.rooms);
      await writeCollection("liveSites", seed.liveSites);
      await writeCollection("cameras", seed.cameras);
      await writeCollection("posts", seed.posts);
      await writeCollection("users", seed.users);
      await writeCollection("settings", seed.settings);
      await writeJsonFileAtomic(progressPath(), seed.progress);
      await writeJsonFileAtomic(cameraSecretsPath(), seed.cameraSecrets);
      await writeFile(
        seedMarkerPath(),
        JSON.stringify({ seededAt: now(), version: 1 }, null, 2),
        "utf8",
      );
    }
  });
}

export async function listConstructionProgress(): Promise<ConstructionProgress[]> {
  return readJsonFile<ConstructionProgress[]>(progressPath(), []);
}

export async function getConstructionProgressById(
  id: string,
): Promise<ConstructionProgress | null> {
  const items = await listConstructionProgress();
  return items.find((p) => p.id === id) ?? null;
}

export async function getConstructionProgressByProjectId(
  projectId: string,
): Promise<ConstructionProgress | null> {
  const items = await listConstructionProgress();
  return items.find((p) => p.projectId === projectId) ?? null;
}

// Auto-initialize when imported on server (non-blocking)
if (typeof window === "undefined") {
  initializeCmsStore().catch((err) => {
    console.error("[cms/store] Failed to initialize CMS store:", err);
  });
}
