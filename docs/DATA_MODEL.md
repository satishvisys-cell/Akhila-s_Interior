# Data Model — Akhila

CMS-first typed domain. UI reads through repositories; no hardcoded project content in components.

**ASSUMPTION:** PostgreSQL + ORM (Prisma/Drizzle) behind `/api` and server components. Swap-ready for Payload/Sanity.

---

## Core entities

### User
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| email | string | unique |
| passwordHash | string | server-only |
| name | string | |
| roleId | uuid | |
| createdAt | datetime | |

### Role
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| key | enum | `super_admin` `admin` `editor` `project_manager` `viewer` |
| permissions | json/string[] | |

### MediaAsset
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| kind | enum | image, video, diagram, snapshot |
| storageKey | string | private bucket key |
| publicUrl | string? | CDN derivative |
| width/height | int | |
| durationMs | int? | video |
| alt | string | |
| blurhash | string? | |
| tags | string[] | |
| folder | string? | |
| metadata | json | EXIF, color, etc. |

Derivatives: `thumb`, `sm`, `md`, `lg`, `xl`, `original` (original never default on mobile).

### Project
| Field | Type | Notes |
|---|---|---|
| id, slug | | unique slug |
| name, location | string | |
| category | enum | residential, commercial, interior, renovation |
| year | int | |
| areaSqm | number | |
| status | enum | completed, in_progress, planned |
| description | text | |
| coverMediaId | uuid | |
| seoTitle, seoDescription | | |
| publishedAt | datetime? | |
| sortOrder | int | |

### Project relations
- `gallery[]` → MediaAsset
- `videos[]` → MediaAsset
- `materials[]` → MaterialSwatch
- `diagrams[]` → Diagram
- `rooms[]` → Room
- `tour` → MasterTour
- `progress` → ConstructionProgress
- `liveSite` → LiveSite?
- `updates[]` → ProjectUpdate

### MasterTour
| Field | Type |
|---|---|
| id, projectId | |
| title | string |
| scenes[] | TourScene ordered |

### TourScene
| Field | Type | Notes |
|---|---|---|
| id | | |
| index | int | 01–07 |
| label | string | Entrance, Living Room, … |
| mediaId | uuid | image or video |
| durationHintMs | int? | |
| thumbnailMediaId | uuid | |

Canonical sequence (do not skip):
1 Entrance · 2 Living Room · 3 Kitchen · 4 Stairs · 5 Hall · 6 Master Bedroom · 7 Bathroom

### Room
| Field | Type |
|---|---|
| id, projectId, slug | |
| name | Living Room, Kitchen, … |
| areaSqm, heightM | number? |
| materials | string[] |
| sortOrder | int |
| states[] | RoomState |

### RoomState
| Field | Type | Notes |
|---|---|---|
| key | enum | `assembled` `exploded` `getting_painted` `final` |
| mediaId | uuid | |
| diagramId | uuid? | exploded |
| labelOverlay | string? | |

Progression strip (UX): VISION → STRUCTURE → DETAIL → FINISH → FINAL (maps to narrative; may bind to state keys).

### Diagram
| Field | Type |
|---|---|
| id | |
| mediaId | |
| title | |
| labels[] | { n, x, y, text } |

### MaterialSwatch
| Field | Type |
|---|---|
| name, finish | |
| colorHex / mediaId | |

### ConstructionProgress
| Field | Type |
|---|---|
| projectId | |
| percent | 0–100 |
| stages[] | ProgressStage |

### ProgressStage
| Field | Type |
|---|---|
| key | planning, foundation, structure, masonry, mep, finishes, interiors, handover |
| status | pending, active, complete |
| percent | |
| mediaIds[] | |
| completedAt | |

### LiveSite
| Field | Type |
|---|---|
| id, projectId, slug | |
| location | |
| stageLabel | |
| percent | |
| visibility | public, private |
| cameras[] | Camera |

### Camera
| Field | Type | Notes |
|---|---|---|
| id | | |
| name | | e.g. Camera 01 — North Elevation |
| locationLabel | | |
| status | live, offline, maintenance | |
| visibility | public, private | |
| sortOrder | | |
| **sourceConfig** | encrypted server-only | **never to client** |
| lastSeenAt | datetime | |

### StreamSession (ephemeral, not long-lived table required)
| Field | Type | Notes |
|---|---|---|
| playbackUrl | signed short-TTL | HLS/DASH |
| expiresAt | | |
| cameraId | | |
| userId? | | |

### Page / Block
| Field | Type |
|---|---|
| Page | slug, title, status, seo |
| Block | type, props json, order, visible |

Block types: hero, text, image, video, gallery, project_grid, statistics, testimonials, timeline, master_tour, room_explorer, live_cctv, construction_progress, cta, faq, team, html

### HeroConfig
Fields matching Stitch Hero Builder: media, heading, subtitle, description, ctaText, ctaUrl, overlayStrength, alignment, animation, visibility, order

### Post (Journal)
| Field | Type |
|---|---|
| slug, title, excerpt | |
| category | architecture, design, construction, materials, technology, project_updates, behind_the_scenes |
| body | richtext/md |
| coverMediaId | |
| authorId | |
| publishedAt | |
| readingTimeMin | |
| status | draft, scheduled, published |

### GalleryItem
mediaId, categories[], projectId?, title, publishedAt

### Navigation / Footer
CMS-managed link trees + newsletter config

### AuditLog
actorId, action, entityType, entityId, meta, createdAt — required for CCTV/admin sensitive actions

---

## Repository interfaces (FE/BE contract)

```ts
ProjectRepository.list(filter) / bySlug(slug)
TourRepository.byProject(projectId)
RoomRepository.byProject(projectId)
LiveSiteRepository.listPublic() / bySlug(slug)
StreamService.createSession(cameraId, userCtx) // server only
MediaRepository.getDerivatives(id, sizes)
PageRepository.bySlug(slug) // block tree
PostRepository.list / bySlug
```

---

## Seed content (dev)

Meridian Residence, Skyline Villa, Casa Horizon, Harbor Point — matching Stitch labels — loaded via seed script, not JSX constants.
