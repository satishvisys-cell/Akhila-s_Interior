# Implementation Prompt — Nav, Projects Hub, Designs Gallery, About CMS, Floating Contact

Copy everything below the line into a new Cursor/agent chat (or hand to frontend + CMS specialists). Treat this as a **product change request** against the existing Akhila Next.js app in `web/`. Do not invent a generic redesign — extend the current editorial system, tokens, admin CMS, and Stitch-aligned visual language.

---

## ROLE

You are the implementation team for **Akhila — Interior Design & Inspired Living** (`Akhila's_Interior` / `web/`).

Stack: Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · GSAP · JSON-file CMS (`web/src/lib/cms/store.ts`) · admin at `/admin`.

**Design source of truth:** preserve premium editorial look (existing tokens in `web/src/styles/tokens.css`, public chrome in `site-header` / `site-footer`). No generic SaaS UI.

**CMS-first:** public content that admins should edit must not require code changes for normal updates.

---

## GOALS (user request)

1. **Projects page becomes a hub** with three clear sections:
   - Ongoing projects
   - Types of projects we offer
   - Completed projects  
   Move existing homepage/project surfaces that belong here onto `/projects` (see mapping below).

2. **Gallery → Designs** — public gallery of **own designs**, fed from **admin uploads** (media library / designs CMS). Rename nav label to **Designs**.

3. **Floating Instagram + WhatsApp** icons site-wide for direct contact (fixed FAB cluster, accessible, mobile-safe).

4. **About page — fully CMS-editable** with structured fields + **AI field improvement** helpers in admin:
   - About the owner
   - Commitments
   - Achievements
   - Trophies
   - Plus sensible extras (mission, values, timeline, press, credentials — see §4)

5. **Re-arrange navbar** to exactly:

   | Order | Label | Route |
   |---|---|---|
   | 1 | About | `/about` |
   | 2 | Projects | `/projects` |
   | 3 | Services | `/services` |
   | 4 | Designs | `/designs` (rename from Gallery; redirect `/gallery` → `/designs`) |
   | 5 | Process | `/process` |
   | 6 | Contact Us | `/contact` |

   Remove from primary nav (unless user later re-asks): Construction (`/live-sites`), Journal (`/journal`). Keep routes alive if linked from elsewhere; just drop from primary header/footer primary lists unless product says otherwise.

---

## CURRENT STATE (inspect before coding)

| Area | Location |
|---|---|
| Public nav constant | `web/src/lib/navigation.ts` → `PUBLIC_NAV` |
| Header | `web/src/components/layout/site-header.tsx` |
| Footer | `web/src/components/layout/site-footer.tsx` |
| CMS seed nav | `web/src/lib/cms/store.ts` (settings `primaryNav`) |
| Admin navigation editor | `web/src/components/admin/editors/navigation-editor.tsx` |
| Projects page | `web/src/app/(public)/projects/page.tsx` |
| Live / ongoing teaser | `web/src/components/sections/live-projects-carousel.tsx`, `/live-sites` |
| Services / “types we offer” | `web/src/components/sections/what-we-offer.tsx`, `/services`, `web/src/lib/services.ts` |
| Featured / completed works | `web/src/components/sections/featured-collection.tsx`, project CMS `publishStatus` / `status` |
| Gallery | `web/src/app/(public)/gallery/page.tsx`, `/admin/gallery` |
| About (mostly static) | `web/src/app/(public)/about/page.tsx` |
| Domain types | `web/src/domain/types.ts` |
| Media upload | `/admin/media-library`, `/api/admin/media/upload` |

**Assumption (record):** “Types of projects we offer” maps to **project categories / service offerings shown as project types** on `/projects` (not a duplicate of full `/services`). If services already cover this exhaustively, `/projects` should deep-link into Services for “View all services” while still showing a curated type grid.

**Assumption:** Ongoing ≈ live/in-progress projects (`status` in progress / live sites / `publishStatus` + project status). Completed ≈ published finished works.

---

## 1. NAVBAR + FOOTER

### Requirements

Update **all** of:

1. `PUBLIC_NAV` in `navigation.ts`
2. Hardcoded footer link arrays in `site-footer.tsx`
3. Seed / default `primaryNav` in CMS store + admin navigation editor defaults
4. Any homepage CTAs that say “Gallery” → “Designs”

New `PUBLIC_NAV`:

```ts
export const PUBLIC_NAV = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/designs", label: "Designs" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact Us" },
] as const;
```

### Redirects

- Permanent or permanent-ish redirect: `/gallery` → `/designs`, `/gallery/*` → `/designs` (or `/designs/[id]` if detail exists).
- Prefer Next.js `redirects` in `next.config.ts` **and** keep a thin `/gallery` route that redirects so old links don’t 404.

### Mobile menu

Same order and labels; touch targets ≥ 44px; “Contact Us” wording exact.

---

## 2. PROJECTS PAGE HUB (`/projects`)

### Information architecture

Single page, three stacked sections (one job each):

```
/projects
  01 — Ongoing Projects
  02 — Types of Projects We Offer
  03 — Completed Projects
```

Optional sticky in-page subnav (desktop) jumping to `#ongoing` `#types` `#completed`.

### Content mapping (move here)

| Section | Source / move from | Behavior |
|---|---|---|
| **Ongoing** | Live projects carousel / live-sites listing / projects with status `in_progress` / `active` | Cards with location, phase, LIVE badge when applicable; link to `/projects/[slug]` or `/live-sites/[slug]` as appropriate |
| **Types we offer** | Curated subset of services / project categories | Grid or editorial rows; each type links to `/services#…` or filtered projects |
| **Completed** | Current Selected Works / featured collection / `status: completed` published projects | Asymmetric or editorial grid; filters optional (residential / commercial) |

### Homepage impact

After moving:

- Homepage may keep **short teasers** that link to `/projects#ongoing` etc., but should not duplicate the full three-section experience.
- Remove or slim homepage sections that are now redundant on Projects (document what you moved).

### Data model

Prefer CMS-driven:

- Extend `Project` with clear lifecycle: e.g. `lifecycle: "ongoing" | "completed"` **or** reuse existing `status` / `ProjectStatus` consistently — pick one model, migrate seed data, update admin project editor.
- “Types we offer” may be a small CMS collection `projectTypes` **or** reuse `services` with `showOnProjectsPage: true`. Prefer reuse if fields already exist.

### Loading / empty / error

Each section: loading skeleton, empty state (“No ongoing projects yet”), error state.

---

## 3. DESIGNS (formerly Gallery)

### Public

- Route: `/designs` (primary)
- Rename UI copy: page title, metadata, breadcrumbs, admin labels where user-facing
- Content: **studio’s own designs** uploaded via admin (images; optional title, category, tags, year, featured flag)
- Layout: masonry / editorial grid + lightbox; category filters if data supports it
- Empty state when no designs published

### Admin

- Strengthen `/admin/gallery` (rename UI to **Designs**) or add `/admin/designs`
- Upload via media library → attach to Design entries
- Fields: title, slug, cover media, gallery media IDs, category, description, `publishStatus`, sortOrder
- Only `published` items appear on public Designs page

### Migration

- Move/rename gallery seed + components carefully (`gallery-viewer`, gallery page)
- Update internal links from `/gallery` → `/designs`

---

## 4. ABOUT — CMS + AI IMPROVE

### Public `/about`

Replace static hardcoding with CMS-driven sections:

| Block | Fields (editable) |
|---|---|
| Hero / intro | Eyebrow, headline, short intro, optional portrait media |
| **About the owner** | Name, role/title, bio (rich text or markdown), photo, optional quote |
| **Commitments** | List of commitment items (title + body); optional icon/media |
| **Achievements** | List (title, year, description, optional link) |
| **Trophies / awards** | List (name, year, org, image, description) |
| Mission / values | Short mission + value cards (recommended extra) |
| Timeline / journey | Optional year milestones |
| CTA | Contact CTA band |

Respect loading / empty: if a list is empty, hide the section (don’t show empty headings).

### Admin

- New admin area: `/admin/about` (or edit via Pages builder + dedicated `about` document — **prefer a dedicated `about` collection/singleton** for structured fields)
- CRUD for each list section (add / reorder / hide / delete)
- Media pickers for portraits and trophy images
- Preview parity with public page

### AI field improvements

In admin, on long-text fields (owner bio, commitment body, achievement description, trophy blurb, mission):

- Button: **Improve with AI** (and optional variants: Shorter / More premium / More warm)
- Server API: e.g. `POST /api/admin/ai/improve-copy`  
  - Auth: `requireAdmin` / same session as other admin APIs  
  - Input: `{ fieldKey, currentText, tone?, maxWords? }`  
  - Output: `{ suggestion: string }` — admin can Accept / Dismiss (never auto-overwrite without confirm)
- Provider: use env `OPENAI_API_KEY` or existing project AI pattern if present; if no key, show clear disabled state + setup hint — **do not fake success**
- Rate-limit the endpoint; never expose API keys to the client
- Log admin AI actions lightly if audit helper exists

### Domain types (sketch)

```ts
interface AboutPageContent {
  id: string;
  hero: { eyebrow?: string; title: string; intro: string; mediaId?: string };
  owner: { name: string; title: string; bio: string; photoMediaId?: string; quote?: string };
  commitments: Array<{ id: string; title: string; body: string; sortOrder: number; visible: boolean }>;
  achievements: Array<{ id: string; title: string; year?: number; body: string; url?: string; sortOrder: number; visible: boolean }>;
  trophies: Array<{ id: string; name: string; year?: number; organization?: string; body?: string; mediaId?: string; sortOrder: number; visible: boolean }>;
  values?: Array<{ id: string; title: string; body: string; sortOrder: number; visible: boolean }>;
  cta?: { title: string; body?: string; buttonLabel: string; buttonHref: string };
  seo: SeoConfig;
  updatedAt: string;
}
```

Wire into `CollectionName` / store + seed with sensible Akhila defaults so the page isn’t empty after deploy.

---

## 5. FLOATING INSTAGRAM + WHATSAPP

### UX

- Fixed position: bottom-right (or bottom-left if it collides with existing “back to top” — **stack** with back-to-top: WhatsApp + Instagram above it, or left cluster)
- Two circular / rounded icon buttons: WhatsApp, Instagram
- Always visible on public pages (optional: hide on `/admin`)
- `aria-label`s; focus-visible rings; ≥ 44×44 touch targets
- Respect `prefers-reduced-motion` (no bounce spam)
- z-index below modals, above content (`z-header`-adjacent token)

### Config (CMS / settings)

Store in `SiteSettings` (admin Settings):

```ts
socialContact: {
  whatsappE164: string;      // e.g. "13105550148"
  whatsappMessage?: string;  // optional prefill
  instagramUrl: string;      // https://instagram.com/...
  floatingEnabled: boolean;
}
```

Links:

- WhatsApp: `https://wa.me/<number>?text=<encoded>`
- Instagram: configured URL (new tab, `rel="noopener noreferrer"`)

### Component

- `web/src/components/layout/floating-contact.tsx`
- Mount from `PublicShell` so all public routes get it

---

## 6. IMPLEMENTATION ORDER

1. Nav + footer + redirects (quick win, unblocks IA)
2. Floating contact (settings fields + component)
3. Projects hub (data model + page composition + homepage slim)
4. Designs rename + admin upload path
5. About CMS singleton + public render
6. AI improve API + admin UI
7. Seed data + docs (`PAGE_MAP`, `STATUS`) + smoke QA

---

## 7. ACCEPTANCE CRITERIA

- [ ] Primary nav order/labels match § Goals exactly on desktop + mobile
- [ ] `/gallery` redirects to Designs; Designs shows only admin-published design media
- [ ] `/projects` shows Ongoing, Types, Completed as distinct sections with real data paths
- [ ] Homepage no longer owns the full projects hub content (teasers OK)
- [ ] About content editable in admin; public page updates without code changes
- [ ] AI Improve returns a suggestion behind auth; Accept applies to field; missing API key = honest disabled state
- [ ] Floating WhatsApp + Instagram work on mobile/desktop; configurable; don’t cover primary CTAs awkwardly
- [ ] `tsc` / lint / `npm run build` pass (including Vercel `/tmp` CMS behavior)
- [ ] No secrets in client bundles; AI key server-only
- [ ] Keyboard + reduced-motion OK for new chrome

---

## 8. OUT OF SCOPE (unless asked)

- Full CCTV gateway
- Renaming Journal/Construction public routes deletion (nav removal only)
- New Stitch screens (if visual layout changes heavily, record `STITCH_UNAVAILABLE` and stay on-token; don’t invent a new brand palette)

---

## 9. DELIVERABLES

1. Code changes in `web/` as above  
2. Short note in `docs/STATUS.md` (what moved, new admin routes, env vars for AI)  
3. Update `docs/PAGE_MAP.md` nav + routes  
4. Browser smoke: nav, `/projects` anchors, `/designs`, `/about`, floating links  

---

## START

1. Read `navigation.ts`, `about/page.tsx`, `projects/page.tsx`, `gallery/page.tsx`, `domain/types.ts`, `cms/store.ts`, `site-header.tsx`, `public-shell.tsx`.  
2. Propose a brief file-level plan (no long pause for approval unless a MATERIAL_HUMAN_DECISION — e.g. deleting `/live-sites`).  
3. Implement in the order in §6.  
4. Verify acceptance checklist.

Begin now.
