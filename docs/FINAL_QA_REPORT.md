# Final QA Report — Akhila Architecture Platform

**Date:** 2026-09-06  
**Build:** `web@0.1.0` — Next.js 16 / React 19 / TypeScript  
**Evidence:** `npm run build` ✓ · `npm run lint` (warnings only in CMS store historically) · `npm audit --omit=dev` → 0 vulns  

---

## 1. Verdict

| Gate | Result |
|---|---|
| Admin shell + full nav | **PASS** |
| Reusable CRUD patterns | **PASS** (collection lists + shared editors) |
| Page Builder (block library) | **PASS** (draft/publish/reorder/hide/duplicate) |
| Hero Builder + device preview | **PASS** |
| Project CMS | **PASS** (draft/published/archived + SEO + relations) |
| CCTV manager (secrets isolated) | **PASS** |
| Media library (upload + validate) | **PASS** (derivative generation still placeholder) |
| RBAC + session auth | **PASS** |
| Security audit doc | **PASS** → `/docs/SECURITY_AUDIT.md` |
| Public Stitch homepage fidelity | **PARTIAL** (foundation + design system; full cinematic homepage incomplete) |
| Master Tour / Room Explorer public UX | **PARTIAL** |
| Real CCTV HLS proxy | **STUB** |
| Animation pass (full Stitch motion) | **PARTIAL** (tokens + utilities + reduced-motion; not every public surface) |
| E2E browser matrix (desktop/tablet/mobile) | **PARTIAL** (static route inventory + build; Playwright run not fully executed this cycle) |

**Overall:** Admin CMS foundation is **IMPLEMENTED** and build-verified. Public cinematic experience and production CCTV are **not** `VERIFIED_PRODUCTION`. Issues found during this cycle were fixed in code where feasible rather than only documented.

---

## 2. Admin route coverage

All routes compile and are dynamic (auth-gated) unless noted.

| Route | Purpose | QA notes |
|---|---|---|
| `/admin/login` | Auth | Seed: `admin@akhila.com` / `Admin!ChangeMe1` — change immediately |
| `/admin` | Dashboard KPIs | OK |
| `/admin/projects`, `/new`, `/[id]` | Project CMS | Draft/publish/archive, SEO, media refs |
| `/admin/pages`, `/[id]/builder` | Page builder | Full block library incl. Hero→FAQ/Team |
| `/admin/hero-sections`, `/[id]` | Hero builder | Live + desktop/tablet/mobile preview |
| `/admin/master-tours` | Tours | Collection list (CRUD via shared pattern) |
| `/admin/rooms` | Rooms | Collection list |
| `/admin/diagrams` | Diagrams | Thin/empty seed OK |
| `/admin/gallery` | Gallery | Collection list |
| `/admin/videos` | Videos | Collection list |
| `/admin/posts` | Journal | Collection list |
| `/admin/live-sites` | Live sites | Collection list |
| `/admin/cctv` | CCTV manager | Create/edit/delete, secret field, preview session |
| `/admin/construction-progress` | Progress | Collection list |
| `/admin/testimonials` | Testimonials | Thin/empty seed OK |
| `/admin/team` | Team | Thin/empty seed OK |
| `/admin/navigation` | Nav editor | OK |
| `/admin/media-library` | Media | Upload + MIME validation |
| `/admin/users` | Users | List/RBAC surface |
| `/admin/roles` | Roles | Permission matrix surface |
| `/admin/seo` | SEO | Settings-linked |
| `/admin/analytics` | Analytics | Placeholder |
| `/admin/settings` | Settings | OK |
| `/admin/preview/page/[id]` | Draft preview | Uses shared public-safe renderers |
| `/admin/preview/hero/[id]` | Hero preview | Device frames |

### Admin UX requirements checklist

| Requirement | Status |
|---|---|
| Responsive admin layout | Pass |
| Sidebar + top nav + breadcrumbs | Pass |
| Tables / filters / search / pagination | Pass (shared data-table / collection list) |
| Bulk actions | Partial (selection patterns exist; not every collection) |
| Modals / drawers / forms / confirmations | Pass |
| Loading / empty / error / toasts | Pass |

---

## 3. API coverage

| Endpoint | Auth | Notes |
|---|---|---|
| `POST /api/admin/auth/login` | Public + rate limit | Generic errors |
| `POST /api/admin/auth/logout` | Session | Clears cookie |
| `GET/POST /api/admin/projects` | RBAC | Zod validation |
| `PATCH /api/admin/projects/[id]` | RBAC | Revision-safe updates via store |
| `GET/POST /api/admin/pages` | RBAC | |
| `PATCH /api/admin/pages/[id]` | RBAC | Blocks + status |
| `PATCH /api/admin/heroes/[id]` | RBAC | Publish validation for media/links |
| `GET/POST /api/admin/cameras` | `camera:view` / `manage` | Secrets stripped |
| `PATCH/DELETE /api/admin/cameras/[id]` | `camera:manage` | Deletes secret on DELETE |
| `POST /api/admin/cameras/[id]/secret` | `camera:manage` | Never echoes secret |
| `GET /api/admin/media` · `POST .../upload` | `media:write` on upload | MIME + rate limit |
| `GET/PATCH /api/admin/settings` | Settings permission | |
| `POST /api/streams/sessions` | Public or `camera:view` | Opaque playback URL only |
| `GET /api/streams/playback/[token]` | Token | Stub player/proxy |

**Unauthorized access:** Protected routes return 401/403 without session/permission. Middleware redirects bare `/admin/*` to login.

---

## 4. Public site QA

| Surface | Status |
|---|---|
| `/` homepage shell | Partial vs Stitch (brand tokens OK) |
| `/design-system` | Pass |
| Projects / Tour / Rooms / Live / Gallery / Journal | Incomplete vs full Stitch catalog |
| 404 | Next default `_not-found` |
| Prefers-reduced-motion | Base CSS disables long animations |

---

## 5. Media & performance

| Requirement | Status |
|---|---|
| 4K as source quality | Policy documented; upload accepts large assets |
| Responsive derivatives (thumb→desktop) | Helpers present; generation often placeholders → **do not ship 4K as default src** |
| Lazy loading / srcset | Utilities ready; wire on all public image components |
| Hero preload only | Intended pattern; verify per page when public heroes bind CMS |
| Master Tour no parallel 4K preload | Enforce when tour player ships |
| Gallery virtualize/paginate | Admin lists paginate; public gallery TBD |
| LCP / CLS / INP / TTFB monitoring | Not instrumented in production yet |

---

## 6. Animation pass

| Motion | Status |
|---|---|
| Motion tokens + CSS (`motion-fade-up`, etc.) | Pass |
| Reduced motion respected | Pass (global + utility) |
| Page / hero / gallery / tour transitions | Partial — continue against Stitch MOTION.md |
| Avoid bounce / GPU loops | Policy enforced in presets |

---

## 7. Accessibility (critical)

| Check | Status |
|---|---|
| Focus-visible styles | Pass (global) |
| Dialog/drawer focus trap | Pass (Drawer/Modal) |
| Form labels | Pass on primary editors |
| Full axe audit all pages | Not completed this cycle |

---

## 8. Security cross-check

See `/docs/SECURITY_AUDIT.md`. Summary:

- No secrets in frontend ✓  
- No private CCTV URLs in client APIs ✓  
- RBAC server-side ✓  
- Upload validation + rate limits ✓  
- Remaining: real stream proxy, secret encryption, CSRF/CSP  

---

## 9. Issues fixed this cycle (not merely documented)

1. Full CCTV manager UI (drawer, secret POST, preview session, delete)  
2. Camera DELETE + secret cleanup  
3. Upload rate limiting  
4. Motion presets + CSS utilities  
5. Security audit + this QA report  

---

## 10. Open defects / follow-ups

| ID | Severity | Item |
|---|---|---|
| QA-01 | High | Complete Stitch public homepage + project detail fidelity |
| QA-02 | High | Wire CMS heroes/pages to public routes with publish gates |
| QA-03 | High | Implement real media derivative pipeline (Sharp/ffmpeg) |
| QA-04 | High | Replace stream playback stub with authenticated proxy |
| QA-05 | Med | Playwright matrix: every admin + public page × desktop/tablet/mobile |
| QA-06 | Med | Analytics page is placeholder |
| QA-07 | Med | Diagrams/testimonials/team seeds sparse |
| QA-08 | Low | Migrate deprecated Next middleware → proxy convention |

---

## 11. How to verify locally

```bash
cd web
cp .env.example .env.local   # set SESSION_SECRET (≥32 chars)
npm install
npm run build
npm run dev
```

1. Open `/admin/login` → seed credentials → change password in Users when available  
2. Exercise Projects, Page Builder, Hero Builder, Media upload, CCTV create + secret + Preview  
3. Confirm Network tab: camera APIs never return RTSP URLs  
4. Open `/admin/preview/hero/[id]` and `/admin/preview/page/[id]`  

---

## 12. Sign-off

| Claim | Allowed? |
|---|---|
| Admin CMS foundation implemented | **Yes** (build evidence) |
| Stitch admin dashboard nav complete | **Yes** |
| Public site Stitch-complete | **No** |
| Production CCTV ready | **No** |
| `VERIFIED_PRODUCTION` | **No** — continue QA-01…QA-05 + security P0 items |

**Next automatic phase:** Public homepage binding to CMS → Master Tour/Room Explorer → real media pipeline → Playwright E2E → production release gate.
