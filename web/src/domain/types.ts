/**
 * Akhila CMS — canonical domain types.
 * Client-safe shapes exclude server-only fields (passwordHash, camera credentials).
 */

// ---------------------------------------------------------------------------
// Roles & permissions
// ---------------------------------------------------------------------------

export type RoleKey =
  | "super_admin"
  | "admin"
  | "editor"
  | "project_manager"
  | "viewer";

export type Permission =
  | "project:read"
  | "project:write"
  | "project:publish"
  | "page:write"
  | "page:publish"
  | "media:write"
  | "camera:view"
  | "camera:manage"
  | "user:manage"
  | "role:manage"
  | "settings:write"
  | "seo:write"
  | "analytics:read"
  | "audit:read";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export type PublishStatus = "draft" | "published" | "archived" | "scheduled";

export type ISODateString = string;

export interface Timestamps {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface SeoConfig {
  title?: string;
  description?: string;
  ogImageMediaId?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export type MediaKind = "image" | "video" | "diagram" | "snapshot";

export type MediaDerivativeKey =
  | "thumb"
  | "mobile"
  | "tablet"
  | "desktop"
  | "original";

export interface MediaDerivative {
  key: MediaDerivativeKey;
  url: string;
  width: number;
  height: number;
  mimeType: string;
  sizeBytes: number;
}

export interface MediaAsset extends Timestamps {
  id: string;
  kind: MediaKind;
  storageKey: string;
  publicUrl?: string;
  width: number;
  height: number;
  durationMs?: number;
  alt: string;
  blurhash?: string;
  tags: string[];
  folder?: string;
  metadata: Record<string, unknown>;
  derivatives: Partial<Record<MediaDerivativeKey, MediaDerivative>>;
}

// ---------------------------------------------------------------------------
// Project & related entities
// ---------------------------------------------------------------------------

export type ProjectCategory =
  | "residential"
  | "commercial"
  | "interior"
  | "renovation";

export type ProjectStatus = "completed" | "in_progress" | "planned";

export interface MaterialSwatch {
  id: string;
  name: string;
  finish: string;
  colorHex?: string;
  mediaId?: string;
}

export interface DiagramLabel {
  n: number;
  x: number;
  y: number;
  text: string;
}

export interface Diagram {
  id: string;
  mediaId: string;
  title: string;
  labels: DiagramLabel[];
}

export type RoomStateKey =
  | "assembled"
  | "exploded"
  | "getting_painted"
  | "final";

export interface RoomState {
  key: RoomStateKey;
  mediaId: string;
  diagramId?: string;
  labelOverlay?: string;
}

export interface Room extends Timestamps {
  id: string;
  projectId: string;
  slug: string;
  name: string;
  areaSqm?: number;
  heightM?: number;
  materials: string[];
  sortOrder: number;
  states: RoomState[];
}

export interface TourScene {
  id: string;
  index: number;
  label: string;
  mediaId: string;
  durationHintMs?: number;
  thumbnailMediaId?: string;
}

export interface MasterTour extends Timestamps {
  id: string;
  projectId: string;
  title: string;
  scenes: TourScene[];
}

export type ProgressStageKey =
  | "planning"
  | "foundation"
  | "structure"
  | "masonry"
  | "mep"
  | "finishes"
  | "interiors"
  | "handover";

export type ProgressStageStatus = "pending" | "active" | "complete";

export interface ProgressStage {
  key: ProgressStageKey;
  status: ProgressStageStatus;
  percent: number;
  mediaIds: string[];
  completedAt?: ISODateString;
}

export interface ConstructionProgress extends Timestamps {
  id: string;
  projectId: string;
  percent: number;
  stages: ProgressStage[];
}

export type CameraStatus = "live" | "offline" | "maintenance";

export type Visibility = "public" | "private";

/** Client-safe camera — credentials live in server-only camera-secrets.json */
export interface Camera {
  id: string;
  name: string;
  locationLabel: string;
  status: CameraStatus;
  visibility: Visibility;
  sortOrder: number;
  /** Optional project assignment for Live Sites / Project CMS */
  projectId?: string | null;
  /** Opaque reference to server-only stream source config */
  streamSourceId: string;
  lastSeenAt?: ISODateString;
}

export interface LiveSite extends Timestamps {
  id: string;
  projectId: string;
  slug: string;
  location: string;
  stageLabel: string;
  percent: number;
  visibility: Visibility;
  cameras: Camera[];
}

export interface ProjectUpdate {
  id: string;
  title: string;
  body: string;
  mediaIds: string[];
  publishedAt: ISODateString;
}

export interface Project extends Timestamps {
  id: string;
  slug: string;
  name: string;
  location: string;
  category: ProjectCategory;
  year: number;
  areaSqm: number;
  status: ProjectStatus;
  description: string;
  coverMediaId: string;
  seoTitle?: string;
  seoDescription?: string;
  seo?: SeoConfig;
  publishStatus: PublishStatus;
  publishedAt?: ISODateString;
  scheduledAt?: ISODateString;
  sortOrder: number;
  galleryMediaIds: string[];
  videoMediaIds: string[];
  materials: MaterialSwatch[];
  diagramIds: string[];
  roomIds: string[];
  tourId?: string;
  progressId?: string;
  liveSiteId?: string;
  updates: ProjectUpdate[];
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export type HeroAlignment = "left" | "center" | "right";

export type HeroAnimation =
  | "none"
  | "fade_up"
  | "fade_in"
  | "scale_in"
  | "parallax";

export interface HeroCta {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

export interface HeroConfig extends Timestamps {
  id: string;
  /** Page or section this hero belongs to */
  pageId?: string;
  projectId?: string;
  mediaId: string;
  mobileMediaId?: string;
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  description?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  overlayStrength: number;
  alignment: HeroAlignment;
  animation: HeroAnimation;
  visibility: Visibility;
  sortOrder: number;
}

// ---------------------------------------------------------------------------
// Pages & blocks
// ---------------------------------------------------------------------------

export type BlockType =
  | "hero"
  | "text"
  | "image"
  | "video"
  | "gallery"
  | "project_grid"
  | "statistics"
  | "testimonials"
  | "timeline"
  | "master_tour"
  | "room_explorer"
  | "live_cctv"
  | "construction_progress"
  | "cta"
  | "faq"
  | "team"
  | "html";

export interface BlockBase {
  id: string;
  type: BlockType;
  order: number;
  visible: boolean;
}

export interface HeroBlockProps {
  heroId: string;
}

export interface TextBlockProps {
  heading?: string;
  body: string;
  alignment?: HeroAlignment;
}

export interface ImageBlockProps {
  mediaId: string;
  caption?: string;
  fullBleed?: boolean;
}

export interface VideoBlockProps {
  mediaId: string;
  posterMediaId?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface GalleryBlockProps {
  mediaIds: string[];
  layout?: "grid" | "masonry" | "carousel";
  columns?: number;
}

export interface ProjectGridBlockProps {
  heading?: string;
  category?: ProjectCategory;
  limit?: number;
  projectIds?: string[];
}

export interface StatisticItem {
  value: string;
  label: string;
  suffix?: string;
}

export interface StatisticsBlockProps {
  heading?: string;
  items: StatisticItem[];
}

export interface TestimonialsBlockProps {
  heading?: string;
  testimonialIds: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  mediaId?: string;
}

export interface TimelineBlockProps {
  heading?: string;
  events: TimelineEvent[];
}

export interface MasterTourBlockProps {
  tourId: string;
  heading?: string;
}

export interface RoomExplorerBlockProps {
  projectId: string;
  heading?: string;
  defaultRoomSlug?: string;
}

export interface LiveCctvBlockProps {
  liveSiteId: string;
  heading?: string;
  maxCameras?: number;
}

export interface ConstructionProgressBlockProps {
  progressId: string;
  heading?: string;
  showStages?: boolean;
}

export interface CtaBlockProps {
  heading: string;
  description?: string;
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  backgroundMediaId?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqBlockProps {
  heading?: string;
  items: FaqItem[];
}

export interface TeamBlockProps {
  heading?: string;
  memberIds: string[];
}

export interface HtmlBlockProps {
  html: string;
}

export type PageBlock =
  | (BlockBase & { type: "hero"; props: HeroBlockProps })
  | (BlockBase & { type: "text"; props: TextBlockProps })
  | (BlockBase & { type: "image"; props: ImageBlockProps })
  | (BlockBase & { type: "video"; props: VideoBlockProps })
  | (BlockBase & { type: "gallery"; props: GalleryBlockProps })
  | (BlockBase & { type: "project_grid"; props: ProjectGridBlockProps })
  | (BlockBase & { type: "statistics"; props: StatisticsBlockProps })
  | (BlockBase & { type: "testimonials"; props: TestimonialsBlockProps })
  | (BlockBase & { type: "timeline"; props: TimelineBlockProps })
  | (BlockBase & { type: "master_tour"; props: MasterTourBlockProps })
  | (BlockBase & { type: "room_explorer"; props: RoomExplorerBlockProps })
  | (BlockBase & { type: "live_cctv"; props: LiveCctvBlockProps })
  | (BlockBase & { type: "construction_progress"; props: ConstructionProgressBlockProps })
  | (BlockBase & { type: "cta"; props: CtaBlockProps })
  | (BlockBase & { type: "faq"; props: FaqBlockProps })
  | (BlockBase & { type: "team"; props: TeamBlockProps })
  | (BlockBase & { type: "html"; props: HtmlBlockProps });

export interface Page extends Timestamps {
  id: string;
  slug: string;
  title: string;
  publishStatus: PublishStatus;
  seo: SeoConfig;
  blocks: PageBlock[];
  publishedAt?: ISODateString;
  scheduledAt?: ISODateString;
}

// ---------------------------------------------------------------------------
// Journal, gallery, team, testimonials, navigation
// ---------------------------------------------------------------------------

export type PostCategory =
  | "architecture"
  | "design"
  | "construction"
  | "materials"
  | "technology"
  | "project_updates"
  | "behind_the_scenes";

export interface Post extends Timestamps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  body: string;
  coverMediaId: string;
  authorId: string;
  publishStatus: PublishStatus;
  publishedAt?: ISODateString;
  scheduledAt?: ISODateString;
  readingTimeMin: number;
}

export interface GalleryItem extends Timestamps {
  id: string;
  mediaId: string;
  categories: string[];
  projectId?: string;
  title: string;
  publishedAt?: ISODateString;
}

export interface TeamMember extends Timestamps {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photoMediaId?: string;
  sortOrder: number;
  visible: boolean;
}

export interface Testimonial extends Timestamps {
  id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  photoMediaId?: string;
  projectId?: string;
  sortOrder: number;
  visible: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  sortOrder: number;
  visible: boolean;
  children?: NavItem[];
}

export interface SiteSettings extends Timestamps {
  id: string;
  siteName: string;
  tagline?: string;
  primaryNav: NavItem[];
  footerNav: NavItem[];
  contactEmail?: string;
  socialLinks: Record<string, string>;
  defaultSeo: SeoConfig;
}

// ---------------------------------------------------------------------------
// Users & sessions
// ---------------------------------------------------------------------------

/** Public user shape — never includes passwordHash */
export interface User extends Timestamps {
  id: string;
  email: string;
  name: string;
  role: RoleKey;
  active: boolean;
}

/** Server-only user record stored in JSON */
export interface UserRecord extends User {
  passwordHash: string;
}

export interface AdminUserSession {
  userId: string;
  email: string;
  name: string;
  role: RoleKey;
  issuedAt: ISODateString;
  expiresAt: ISODateString;
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "login"
  | "logout"
  | "login_failed"
  | "camera_access"
  | "stream_session"
  | "settings_change"
  | "role_change";

export interface AuditLog {
  id: string;
  actorId: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  meta?: Record<string, unknown>;
  createdAt: ISODateString;
}

// ---------------------------------------------------------------------------
// Server-only camera secrets (never sent to client)
// ---------------------------------------------------------------------------

export interface CameraStreamSecret {
  rtspUrl?: string;
  username?: string;
  password?: string;
  hlsProxyUrl?: string;
  notes?: string;
}

export type CameraSecretsMap = Record<string, CameraStreamSecret>;
