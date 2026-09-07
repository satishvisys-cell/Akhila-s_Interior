# Component Map — Akhila

Maps Stitch compositions → reusable code components. Prefer extension over one-offs.

---

## A. Design-system primitives (`src/components/ui/`)

| Component | Responsibility | Used by |
|---|---|---|
| `Text` / typography classes | Display→caption roles | All |
| `Button` | primary/secondary/ghost/inverse + loading | Header, CTAs, admin |
| `Link` / `TextLink` | Nav + editorial links | Header, Footer, lists |
| `Badge` | LIVE/OFFLINE/MAINTENANCE + semantic | Live Sites, CCTV, Progress |
| `LiveIndicator` | Pulse + label | CCTV HUD |
| `Input` `Textarea` `Select` | Underline/minimal borders | Contact, Admin |
| `Checkbox` `Radio` | Forms | Contact, Admin |
| `Tabs` `SegmentedControl` | Room states, builders | RoomExplorer, Admin |
| `Modal` `Drawer` | Lightbox, mobile nav, Add Camera | Gallery, Header, CCTV Admin |
| `Tooltip` | Icon affordances | Admin, Tour |
| `Toast` | Feedback | Forms, Admin |
| `Skeleton` | Loading placeholders | All lists |
| `EmptyState` `ErrorState` | Empty/error | All data views |
| `Spinner` / `LoadingBlock` | Inline loading | Media, streams |
| `Breadcrumb` | Nested routes | Live Detail, Admin |
| `Pagination` | Lists | Gallery, Journal, Admin tables |
| `ProgressBar` `ProgressRing` | % complete | Construction, Admin |
| `Timeline` `TimelineStep` | Process, construction, tour | Process, Project, Live |
| `Divider` | Thin stone rules | Metrics, sections |
| `Container` `Section` `Grid` `Stack` | Layout | All pages |
| `AspectBox` | Media ratio lock | Cards, gallery |
| `Icon` | Stroke icons | Metadata, admin |

---

## B. Media (`src/components/media/`)

| Component | Notes |
|---|---|
| `ResponsiveImage` | CMS slot + srcset/AVIF/WebP; never distort |
| `ResponsiveVideo` | Poster + lazy; hero/tour |
| `ImageViewer` / `Lightbox` | Fullscreen, keyboard, swipe |
| `VideoPlayer` | Accessible controls |
| `GalleryGrid` | Masonry/editorial |
| `GalleryFilters` | Category chips |
| `MediaMeta` | Resolution/size labels (admin DAM) |
| `BeforeAfterSlider` | Optional compare |

---

## C. Marketing / storytelling (`src/components/sections/` + `experience/`)

| Component | Stitch usage |
|---|---|
| `SiteHeader` | Transparent→solid; desktop/mobile |
| `MobileNav` | Animated drawer |
| `SiteFooter` | Large premium + compact |
| `HeroCinematic` | Full-bleed image/video + CTAs + scroll cue |
| `ExploreTheBuild` | Optional hero→tour handoff |
| `TrustMetrics` | Counter strip |
| `FeaturedProjects` | Asymmetric editorial grid |
| `ProjectCard` / `ProjectBlock` | Large image + metadata (not generic SaaS card) |
| `ServicesAccordion` / `ServiceSection` | Home charcoal list + Services page |
| `ProcessTimeline` | 01–08 journey |
| `JournalCard` `JournalFeatured` | Editorial posts |
| `TestimonialStrip` | If present in Stitch |
| `ContactForm` | Lead gen |
| `CtaBand` | Final CTA |

---

## D. Project experience

| Component | Notes |
|---|---|
| `ProjectHero` | Media + meta |
| `ProjectOverview` | Copy + stats |
| `ProjectStats` | Area/year/status |
| `DesignStory` | Two-column editorial |
| `MaterialPalette` | Swatches |
| `ExplodedDiagramBoard` | Axonometric + labels |
| `ConstructionProgress` | Stages Planning→Handover |
| `ProjectUpdates` | Timeline posts |
| `ProjectLocation` | Map/address block |
| `ProjectCta` | Discuss similar |

---

## E. Immersive experiences

| Component | Notes |
|---|---|
| `MasterTour` | Film chrome: scenes, thumbs, progress, play/mute/fullscreen |
| `TourScene` | Single scene media |
| `TourTimeline` | 01–07 numbered |
| `RoomExplorer` | **One reusable** explorer; data-driven rooms/states |
| `RoomStateSwitcher` | Assembled / Exploded / Getting Painted / Final |
| `RoomProgressionStrip` | VISION→FINAL |
| `RoomMetaPanel` | Area/height/materials |
| `AxonometricCard` | Diagram preview |

---

## F. Live construction / CCTV

| Component | Notes |
|---|---|
| `LiveSiteCard` / `LiveSiteRow` | Listing |
| `LiveSiteHeader` | Title, stage %, LIVE |
| `CameraViewer` | Primary viewport + HUD |
| `CameraStrip` | Selector; lazy thumbs |
| `CameraStatusDot` | Per camera |
| `SiteActivityLog` | Recent events |
| `SecureStreamNotice` | Authenticated/proxied copy |
| `StreamFallback` | Offline/maintenance/error UI |

**Never:** RTSP URL, username, password in props/client state.

---

## G. Admin (`src/components/admin/`)

| Component | Notes |
|---|---|
| `AdminShell` | Dark sidebar + top bar |
| `AdminSidebar` | Nav + user |
| `AdminTopBar` | Search, notifications |
| `KpiCard` | Dashboard metrics |
| `ActivityTable` | Recent activity |
| `PageBuilder` | Library / Canvas / Inspector |
| `BlockLibrary` | Modular blocks |
| `BlockInspector` | Hero fields etc. |
| `MediaLibraryGrid` | DAM |
| `CameraManagerTable` | CCTV admin |
| `SecureSourceField` | “Configured securely” — no secrets |
| `PublishBar` | Draft / Preview / Publish |

---

## H. Reuse rules

1. One `RoomExplorer` for all rooms — content via CMS props.
2. One `MasterTour` for all projects — scenes via CMS.
3. One `CameraViewer` for public + admin preview (authz differs).
4. Editorial `ProjectBlock` ≠ admin table row.
5. No duplicate Header/Footer per page — layout slot only.

---

## I. Ownership

| Layer | Owner |
|---|---|
| Tokens / primitives | Design system + FE |
| Section renderers | FE (data-driven) |
| CMS schemas | Data + Backend |
| Stream proxy | Backend + Security |
