# Implementation Plan — Akhila

**Status:** `PLANNED` → foundation implementation in progress  
**Visual source of truth:** Stitch project `5989527326589229208`  
**Catalog:** `docs/stitch/SCREEN-CATALOG.md`  
**Previews:** `docs/stitch/previews/`

---

## 0. Non-negotiable rules

1. **Stitch is the visual source of truth.** No redesign, no simplification, no generic replacements.
2. **CMS-first data.** UI never owns content; typed domain models + repositories do.
3. **No secrets in the client.** CCTV credentials/RTSP stay server-side only.
4. **Foundation before features.** Tokens → primitives → shell (Header/Footer) → pages.
5. **States are product.** Loading / empty / error / disabled / offline designed, not bolted on.

---

## 1. Repository reality (inspected)

| Area | State |
|---|---|
| Application code | **Empty** (docs + skills + Stitch artifacts only) |
| Stitch public screens | 13 designed (Home → Contact) |
| Stitch admin screens | 5 designed (Login, Dashboard, Page Builder, CCTV Manager, Media Library) |
| Stitch gaps | Remaining admin editors; mobile variants; Gallery Detail / Journal Article / Service Detail |
| Design docs | `docs/design/*` provisional tokens aligned to Stitch |

**ASSUMPTION:** Brand = **Akhila**. Stack = **Next.js App Router + TypeScript + Tailwind (CSS variables) + server actions/API routes**.

---

## 2. Stitch inventory (pages)

### Public
| Page | Stitch ID | Key compositions |
|---|---|---|
| Home | `dc035a…` | Transparent header, full-bleed hero, metrics, asymmetric featured work, services accordion, footer |
| Projects | `1d127…` | Editorial masonry, filters |
| Project Detail | `d0f345…` | Long-scroll storytelling + tour/progress/CCTV teasers |
| Master Tour | `1f842…` | Full-viewport film player + scene timeline |
| Room Explorer | `1854e…` | Room rail, state switcher, progression strip, axonometric |
| Live Sites | `bc746…` | Listing + security messaging + status badges |
| Live Site Detail | `c7513…` | Primary camera + strip + progress sidebar |
| Gallery | `e4525…` | Masonry + filters |
| Journal | `e3101…` | Featured + editorial grid |
| Services | `edb440…` | Alternating editorial sections |
| Process | `b670e…` | 01–08 vertical timeline |
| About | `984b4…` | Mission / metrics / team |
| Contact | `38cce…` | Split contact + form |

### Admin
| Page | Stitch ID | Key compositions |
|---|---|---|
| Login | `c834b…` | Split image + underline form |
| Dashboard | `a95a9…` | Dark sidebar, KPIs, activity, health |
| Page Builder | `185cc…` | Library / canvas / inspector |
| CCTV Manager | `5b89c…` | Table + secure source drawer |
| Media Library | `b4049…` | DAM grid + metadata |

---

## 3. Interaction & state matrix (cross-cutting)

| Surface | Interactions | States |
|---|---|---|
| Header | Transparent→solid on scroll; mobile drawer; active route | Default, scrolled, open menu, focus |
| Hero | CTAs; Explore the Build; scroll cue | Media loading/error; reduced motion |
| Featured projects | Hover zoom/metadata; asymmetric grid | Empty portfolio |
| Master Tour | Scene nav, play/pause, mute, fullscreen, keyboard | Loading, buffering, error, offline |
| Room Explorer | Room select; Assembled/Exploded/Painted/Final | Media swap loading/error |
| Live CCTV | Camera select; fullscreen; mute; snapshot* | LIVE / OFFLINE / MAINTENANCE / unauthorized / timeout |
| Gallery | Filter, search, lightbox, swipe | Empty, error |
| Journal | Category, search | Empty, error |
| Forms | Focus, validate, submit | Disabled, error, success |
| Admin | CRUD, preview/publish | Draft/scheduled/published; permission denied |

\*Snapshot only if backend supports signed capture.

---

## 4. Responsive strategy

| Breakpoint | Token | Layout intent |
|---|---|---|
| Mobile | `<768` | Single column; hamburger; single CCTV; tour fullscreen |
| Tablet | `768–1023` | 2-col editorial; condensed nav |
| Desktop | `1024–1439` | Stitch desktop compositions |
| Large | `≥1440` | Max content 1440 / media 1680 |

Do **not** shrink desktop layouts — recompose intentionally per Stitch (mobile Stitch pending → document ASSUMPTIONS until mobile screens arrive).

---

## 5. Animation plan (from Stitch + MOTION.md)

- Fade-up / reveal / stagger for sections
- Image hover zoom (GPU transform only)
- Header height/background transition
- Mobile menu slide + fade
- Tour scene crossfade (not carousel)
- LIVE pulse (disabled under `prefers-reduced-motion`)

---

## 6. Dependency order (build sequence)

```text
P0  Tooling scaffold (Next.js, TS, Tailwind, fonts, lint/test)
P1  Design tokens (CSS variables) + DESIGN_SYSTEM sync
P2  Primitives (Button, Link, Input, Badge, Skeleton, …)
P3  Layout shell (Container, Grid, Section)
P4  SiteHeader + SiteFooter (pixel-accurate, a11y, breakpoints)
P5  Data layer contracts (types, repositories, mock CMS)
P6  Media pipeline (responsive Image/Video slots, CMS-ready)
P7  Homepage sections (Stitch order)
P8  Projects list + ProjectDetail section system
P9  MasterTour
P10 RoomExplorer
P11 Live Sites + CameraViewer (+ server stream proxy stubs)
P12 Gallery + Journal
P13 Services / Process / About / Contact
P14 Admin shell + Login + Dashboard
P15 Page Builder / Hero Builder / Project Editor
P16 CCTV Manager / Media Library / Progress / Users / SEO
P17 QA gates (visual vs Stitch, a11y, perf, security)
P18 Release prep
```

**Gate:** Do not start P7 until P1–P4 pass visual + keyboard + responsive checks.

---

## 7. Open questions (non-blocking)

| ID | Question | Default |
|---|---|---|
| OQ-1 | Final CMS (Payload / Sanity / custom)? | Custom Postgres + admin app first; swap later |
| OQ-2 | Stream tech (HLS via MediaMTX / WebRTC)? | HLS via authenticated proxy |
| OQ-3 | Auth provider for admin + private cameras? | Credentials + session cookies (secure) |
| OQ-4 | Hosting? | Vercel public + private stream on VPC later |

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Stitch UI empty / account mismatch | Local previews + SCREEN-CATALOG as working SoT |
| Missing mobile Stitch | Infer from desktop + RESPONSIVE rules; mark `STITCH_MOBILE_PENDING` |
| 4K media CWV regression | Derivatives (AVIF/WebP), lazy load, never load all cameras |
| CCTV credential leak | Server-only secrets; signed short-lived playback URLs |

---

## 9. Immediate next execution

1. Write companion docs (DESIGN_SYSTEM, COMPONENT_MAP, PAGE_MAP, DATA_MODEL, SECURITY_MODEL).
2. Scaffold app + implement tokens + primitives.
3. Implement Header/Footer and verify breakpoints.
4. Only then implement Homepage.
