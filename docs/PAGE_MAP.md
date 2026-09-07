# Page Map — Akhila

Routes, Stitch references, sections, and data dependencies.

**Base URL (public):** `/`  
**Admin:** `/admin/*`  
**Stitch:** https://stitch.withgoogle.com/projects/5989527326589229208

---

## Public routes

| Route | Page | Stitch | Sections / features |
|---|---|---|---|
| `/` | Home | Homepage | Header(transparent), Hero, TrustMetrics, FeaturedProjects, Services teaser, Process strip*, Live Sites teaser*, Journal teaser*, CTA, Footer |
| `/projects` | Projects | Selected Works | Filters, search, asymmetric grid |
| `/projects/[slug]` | Project Detail | Meridian Detail | Hero, Overview, Stats, Concept/Story, Master Tour entry, Room breakdown, Exploded diagrams, Materials, Progress, Live CCTV teaser, Gallery, Videos, Updates, Location, CTA |
| `/projects/[slug]/tour` | Master Tour | Master Tour | Full immersive tour |
| `/projects/[slug]/rooms` | Room Explorer | Room Explorer | Room rail + states |
| `/projects/[slug]/rooms/[room]` | Room deep link | Room Explorer | Same component |
| `/live-sites` | Live Sites | Live Sites | Listing, filters, security messaging |
| `/live-sites/[slug]` | Live Site Detail | Skyline Live | CameraViewer, strip, progress, activity |
| `/gallery` | Gallery | Gallery | Categories, masonry, lightbox |
| `/gallery/[id]` | Gallery Detail | *pending Stitch* | Lightbox-first detail |
| `/journal` | Journal | Journal | Featured + grid + categories |
| `/journal/[slug]` | Article | *pending Stitch* | Body, related, SEO |
| `/services` | Services | Services | 8 editorial sections |
| `/services/[slug]` | Service Detail | *pending Stitch* | Deep service |
| `/process` | Process | How We Build | 01–08 timeline |
| `/about` | About | About | Mission, values, team |
| `/contact` | Contact | Contact | Split form + channels |

\*Include if present in final Stitch homepage HTML; home preview emphasizes Hero → Metrics → Featured → Services → Footer. Full section list from product brief remains the target; implement only sections present in approved Stitch HTML/screenshots for homepage v1, then extend when Stitch adds them.

### Homepage implementation order (Stitch-aligned)

1. Cinematic hero  
2. Trust metrics  
3. Featured projects  
4. Services (charcoal accordion / expertise)  
5. Process teaser (if in HTML)  
6. Live Sites teaser (if in HTML)  
7. Gallery teaser (if in HTML)  
8. Journal teaser (if in HTML)  
9. Testimonials (if in HTML)  
10. Final CTA  
11. Footer  

Architectural storytelling / Master Tour preview / Room breakdown on **home** only if Stitch homepage includes them; otherwise they live on Project Detail.

---

## Admin routes

| Route | Page | Stitch |
|---|---|---|
| `/admin/login` | Login | Admin Login |
| `/admin` | Dashboard | Admin Dashboard |
| `/admin/projects` | Projects | *queued* |
| `/admin/projects/[id]` | Project Editor | *queued* |
| `/admin/pages` | Pages | *queued* |
| `/admin/pages/[id]/builder` | Page Builder | Page Builder |
| `/admin/heroes` | Hero Builder | *queued* |
| `/admin/tours` | Master Tour Builder | *queued* |
| `/admin/rooms` | Room Builder | *queued* |
| `/admin/gallery` | Gallery CMS | *queued* |
| `/admin/media` | Media Library | Media Library |
| `/admin/videos` | Videos | *queued* |
| `/admin/posts` | Posts | *queued* |
| `/admin/live-sites` | Live Sites | *queued* |
| `/admin/cctv` | CCTV Manager | CCTV Manager |
| `/admin/progress` | Progress Manager | *queued* |
| `/admin/users` | Users | *queued* |
| `/admin/roles` | Roles | *queued* |
| `/admin/navigation` | Navigation | *queued* |
| `/admin/seo` | SEO | *queued* |
| `/admin/settings` | Settings | *queued* |
| `/admin/analytics` | Analytics | *queued* |

---

## Layouts

| Layout | Applies | Contains |
|---|---|---|
| `PublicLayout` | all public | SiteHeader, SiteFooter, main |
| `ImmersiveLayout` | tour, room explorer | Minimal chrome |
| `AdminLayout` | `/admin/*` except login | AdminShell |
| `AuthLayout` | login | Split panel |

---

## Navigation (public)

Logo · Projects · Services · Process · Live Sites · Gallery · About · Contact  
Primary CTA: Start a Project · Secondary: View Projects

---

## Content relationships

```text
Project
  ├── Media (cover, gallery, videos)
  ├── Tour (scenes[])
  ├── Rooms[] → states[] → media
  ├── Diagrams[]
  ├── Materials[]
  ├── Progress (stages[])
  ├── LiveSite? → Cameras[]
  ├── Updates[]
  └── SEO

Page
  └── Blocks[] (Hero, Text, Gallery, Tour, CCTV, …)

Post / Journal
  └── Media, categories, author

GalleryItem
  └── Media + categories + project?

Camera
  └── belongsTo LiveSite/Project
  └── playback via StreamSession (server)
```

---

## SEO routes

- Canonical slug URLs for projects, posts, services
- Open Graph from CMS cover media
- JSON-LD for Organization + CreativeWork (projects)
