# STATUS

## Current phase — IA: Projects hub · Designs · About CMS · floating contact

**Prompt:** `docs/IA_NAV_PROJECTS_DESIGNS_ABOUT_PROMPT.md`

### Implemented (2026-09-10)

| Area | Result |
|---|---|
| Primary nav | About → Projects → Services → Designs → Process → Contact Us |
| `/projects` hub | Ongoing · Types we offer · Completed (CMS projects + services) |
| Gallery → Designs | `/designs` + redirect `/gallery` → `/designs`; admin `/admin/designs` |
| Floating contact | WhatsApp + Instagram FABs; Settings `socialContact` |
| About CMS | Singleton `/admin/about` → public `/about` |
| AI improve | `POST /api/admin/ai/improve-copy` (needs `GROQ_API_KEY`) |
| `npx tsc --noEmit` | PASS |

**Env:** optional `GROQ_API_KEY` (+ optional `GROQ_MODEL`, default `openai/gpt-oss-120b`) for About AI improve via Groq.

---

## Prior phase — Stitch v2 fidelity port (public)

**Stitch SoT:** [Cinematic Platform v2](https://stitch.withgoogle.com/projects/15065125676195745336)  
**Local previews:** `docs/stitch/previews-v2/` · catalog `docs/stitch/SCREEN-CATALOG-V2.md`  
**Fidelity prompt:** `docs/STITCH_FIDELITY_SUBAGENT_PROMPT.md`  
**Agent:** Stitch-faithful site port (`c2496b44-a47a-45f6-918f-294c14e5bf6d`)

### Gate status

| Gate | Result |
|---|---|
| Stitch HTML/JPG refresh | PASS — `html-v2/` + `previews-v2/` |
| Catalog fidelity YES/NO | PASS — all 10 routes marked YES |
| `npx tsc --noEmit` | PASS |
| HTTP smoke (dev) | PASS — `/`, `/projects`, `/projects/[slug]`, `/tour`, `/rooms`, `/live-sites`, `/live-sites/[slug]`, `/gallery`, `/journal`, `/journal/[slug]`, `/contact` → 200 |
| Browser console (home) | PASS — no errors |
| Visual side-by-side vs JPG | CONDITIONAL — structure/copy aligned on home + selected works; shared chrome uses homepage nav (not per-screen Stitch variants) |
| VERIFIED_PRODUCTION | NOT GRANTED |

### Public routes (Stitch-aligned)

| Route | Notes |
|---|---|
| `/` | Full-bleed hero, metrics, Selected Works, disciplines, LIVE teaser |
| `/projects` | Overlay grid + filters + LIVE badge + View Archive |
| `/projects/[slug]` | Casa Horizon storytelling + Master Tour CTA + access form |
| `/projects/[slug]/tour` | Immersive Master Tour (no site chrome) |
| `/projects/[slug]/rooms` | Room Explorer tabs |
| `/live-sites` | Stats + featured + cards |
| `/live-sites/[slug]` | Camera UI (preview frames only) |
| `/gallery` | Visual Archive masonry |
| `/journal` | Editorial feature + Latest Entries |
| `/journal/[slug]` | CMS article detail |
| `/contact` | Underline form + Direct Lines + Studio |
| `/services` · `/process` · `/about` | Token-aligned; **no Stitch v2 HTML** |

### Honest gaps

- Shared header/footer = homepage Stitch chrome (ASSUMPTION)  
- CCTV: UI only; no RTSP/credentials in client; stream decode still stubbed  
- Admin CMS functional; Stitch admin screens not ported  
- Services / Process / About lack dedicated Stitch v2 screens  
- Pixel-perfect A39 vs every JPG still open for deeper review  

## Next

1. Deeper visual QA (gallery, tour, live detail, contact) vs `previews-v2`  
2. Optional Stitch screens for Services / Process / About  
3. Admin Stitch fidelity pass  
4. Authenticated stream playback when infra ready  

---

## Master Rebuild Directive — engineering log

### GSAP motion system (delivered, verified)

- `web/src/lib/motion/gsap-client.ts` — single registration point (`gsap`,
  `ScrollTrigger`, `useGSAP`), client-only, HMR-safe.
- `FadeUp` rewritten on GSAP (was `IntersectionObserver`) — same public API,
  ~40 existing call sites upgraded with zero call-site changes.
- `MagneticButton` (`gsap.quickTo` + `contextSafe`) — wired to hero CTA.
- `PinnedStatement` (`ScrollTrigger` `pin` + `scrub` + `timeline` + `stagger`)
  — new "Architectural Statement" homepage section.
- Verified live in a real browser: pin confirmed via `getBoundingClientRect`,
  word-opacity scrub gradient confirmed mid-scroll, `FadeUp` reveal confirmed
  post-refactor, zero console errors through a full scroll pass.
- Docs: `docs/MOTION_SYSTEM.md`.

### CMS data-driven page architecture (delivered, verified)

**Gap found on audit:** the admin Page Builder (`/admin/pages/[id]/builder`)
could create/edit/publish pages, but nothing on the public site ever
rendered them — the "Preview" route was a debug `<pre>{JSON.stringify(...)}`
dump. This is exactly the "fake CMS control" the directive prohibits and
violates the data-driven page rule (frontend needing zero changes when
content changes).

**Fixed:**
- `lib/cms/resolve-blocks.ts` — resolves `PageBlock[]` (ID references) into
  fully-hydrated `ResolvedBlock[]` (real media/project/tour/room/live-site/
  progress entities), batching store reads instead of N+1 per block.
- `components/cms/page-block-renderer.tsx` — real production renderer for
  all 15 `BlockType`s (hero, text, image, video, gallery, project_grid,
  statistics, timeline, master_tour, room_explorer, live_cctv,
  construction_progress, cta, faq, html). `testimonials`/`team` render
  nothing (no CMS collection exists yet for them — tracked gap below, not
  faked).
- `app/(public)/[slug]/page.tsx` — new catch-all public route. Next.js
  resolves static routes (`/about`, `/projects`, etc.) first, so existing
  hand-built pages are unaffected. Any page an admin publishes goes live
  here immediately.
- Admin preview now renders through the **same** `PageBlockRenderer` as the
  public route — preview is no longer a lie.
- **Verified live:** the seeded CMS page (`slug: "home"`, hero + project_grid
  blocks) renders correctly at `/home` — confirmed hero heading, project grid
  heading, and page title all present, zero renderer-related console errors.

**Honest gap surfaced by this verification (pre-existing, not introduced
here):** seed CMS data references media at `/media/meridian/...`,
`/media/skyline/...`, `/media/site/...` but `public/media/` only contains
`hero-placeholder.svg` — these files were never actually uploaded. Any
CMS-driven route (this new one, and existing `/projects/[slug]` etc.) will
404 those specific images until real media is uploaded through the media
library or the seed data is pointed at real files. Not fixed in this pass —
flagged for the media pipeline phase.

### Design system: token consolidation & full application (delivered, verified)

**Gap found on audit:** `src/styles/tokens.css` already defined a correct,
Stitch-sourced semantic token system (§19 background/surface/text/border/
accent), but it was only partially wired to the Tailwind `@theme`, and
**~24 component/page files bypassed it entirely**, hardcoding raw hex
Tailwind arbitrary values (`bg-[#2C2A26]`, `text-[#FBF9F6]/70`, etc.).
Worse, a second near-duplicate "v1" palette (`#30332F`, `#FFF6F0`,
`#B1B3AD`, `#0E0E0D`, `#9E422C`, `#F5F3F0`, `#DCDAD4`, `#625F5A`) had leaked
into several files alongside the canonical v2 palette — two visually
near-identical but distinct color sets fighting each other, which is
precisely the "random/scattered values" §17/§56 prohibits and produces a
subtly inconsistent, non-premium result across pages.

**Fixed:**
- Extended `tokens.css` with the missing semantic layer from §19/§25:
  `--bg-inverse`, `--charcoal`, `--ink`, `--surface-2`, `--text-secondary`,
  `--border-strong`, `--status-success`/`--status-error`, plus cinematic
  motion primitives (`--ease-enter`, `--ease-exit`, `--ease-cinematic`,
  `--dur-cinematic`).
- Exposed all of it through `@theme inline` in `globals.css` as real
  Tailwind utilities: `bg-charcoal`, `bg-ink`, `bg-surface-2`, `bg-ivory`,
  `text-text-secondary`, `text-text-inverse`, `border-border`, `bg-live`,
  `bg-accent`/`bg-accent-hover`, `bg-graphite`, etc.
- Mechanically replaced **420 raw-hex Tailwind classes across 26 files**
  (`page-block-renderer.tsx`, homepage, `master-architectural-film`,
  `interactive-floor-plan`, `room-state-matrix`, `live-camera-viewer`,
  `construction-telemetry`, `site-header`/`site-footer`, `video-player`,
  `before-after-video`, all public route pages, etc.) with the token
  utilities above — including consolidating the duplicate v1 palette onto
  the canonical v2 tokens rather than leaving two palettes coexisting.
- Caught and fixed a real bug introduced mid-refactor: `#FBF9F6` on a
  `text-*` prefix was mapped to a nonexistent `text-inverse` class instead
  of the actual generated Tailwind name `text-text-inverse` (Tailwind's
  utility name is `{prefix}-{theme-color-key}`, and the color key here is
  itself `text-inverse`). Verified via `getComputedStyle` in a live browser
  that the bad class silently produced **no color rule at all** (text fell
  back to inherited body color) — then fixed all 93 affected occurrences
  and re-verified computed styles resolve to the exact intended RGB values
  (`bg-charcoal` → `rgb(44,42,38)`, `text-text-inverse` → `rgb(251,249,246)`,
  `bg-ink`, `bg-surface-2`, `text-text-secondary`, `bg-live` all confirmed).
- **Verified:** zero raw hex Tailwind classes remain anywhere in `src`
  (`rg` sweep confirmed empty), `tsc --noEmit` clean, all 12 touched public
  routes return `200`, zero renderer-related console errors on homepage and
  a project detail page (the one console error present — a 404 for
  `/media/meridian/hero-axonometric.jpg` — is the pre-existing missing-seed-
  media gap already logged above, not a regression from this change).

**Scope note (honest):** this pass consolidates and correctly *applies* the
existing token system everywhere it was being bypassed — it is not a new
visual direction, since the current palette/typography already are the
Stitch v2 source of truth and the always-on rule prohibits replacing an
approved design with something generic. A from-scratch *visual* redesign
(new layout composition, new component silhouettes) would need new Stitch
screens to stay compliant with "design is the source of truth" — flagged as
an open question, not assumed.

### Homepage visual redesign via Stitch (delivered, verified)

**Context:** Stitch MCP was disconnected in this Cursor session (`Not connected`); root
cause found and fixed — `mcp.json`'s `stitch` entry used `"command": "node"`,
which doesn't resolve because Cursor's GUI process doesn't inherit the shell
`PATH` (`/opt/homebrew/bin` missing). Repointed it at the absolute binary
(`/opt/homebrew/bin/node`); reconnected immediately, verified via
`list_projects`/`get_project`. Also confirmed the Antigravity-side Stitch MCP
config (installed in an earlier session) is intact in `~/.gemini/config/
mcp_config.json` and `~/.gemini/antigravity/mcp_config.json`.

**Work:** Generated 3 `REIMAGINE`-range homepage variants in the existing
"Akhila Architecture — Cinematic Platform v2" Stitch project (grounded in the
Master Rebuild Directive's video-first/cinematic brief, same locked palette
and type system). Presented screenshots + a structural critique of all 3 to
the user (flagged Variant 2's off-palette teal CTA banner as a defect rather
than silently omitting it). User selected **Variant 1 — "Cinematic
Sequence."**

**Ported to code** (kept the existing video hero and the deeper interactive
sections — Master Architectural Film, Room State Matrix, Interactive Floor
Plan — since they already exceed what a static Stitch mock can express;
only added the genuinely new structural pieces from the chosen variant):
- `components/sections/selected-works-teaser.tsx` (new) — asymmetric
  staggered 3-card "Selected Works" grid (large 16:9 / offset vertical 3:4 /
  offset ultrawide 21:9), metadata below each frame, real project hrefs.
- `components/sections/expertise-list.tsx` (new) — "Our Core Disciplines"
  accordion on graphite, linking to the real `/services#architecture` /
  `#interior-design` / `#construction` anchors.
- `PinnedStatement` copy updated to the approved variant's manifesto line.
- Both new sections wired into `app/(public)/page.tsx` in the variant's
  sequence position (after Trust Metrics, before the Studio Manifesto).

**Verified:** `tsc --noEmit` clean; all 10 touched public routes return
`200`; live browser check of both new sections (screenshots) confirms
correct rendering; discipline links confirmed to resolve to the real
`/services` anchors (not placeholder `href="#"`); zero console errors.

**Incident during this pass (documented per policy, not swept under):** the
Next.js/Turbopack dev server hard-hung (100% CPU, no response) partway
through — almost certainly from the earlier mass token-substitution pass
touching 26+ files near-simultaneously. Killed and restarted clean
(`rm -rf .next`); a background-launched restart died silently twice before a
foreground-tracked restart succeeded and compiled clean. No code defect —
noted here as an operational fragility (large simultaneous file-edit batches
can overwhelm the Turbopack watcher) for future large mechanical refactors:
prefer smaller batches or a dev-server restart immediately after.

### Still open against the 71-section directive

- CCTV: still preview-UI/stub — no authenticated server-side gateway yet.
- Testimonials / Team: domain types + admin pages exist, but no CMS store
  collection wired (not in `CollectionName`) — admin pages for these are
  likely non-functional stubs, unverified this pass.
- Media library: upload UI unverified end-to-end (upload → derivative
  generation → usage tracking).
- Video generation provider adapters (`VideoGenerationService`) — interface
  exists (`lib/media/video-generation-service.ts`), no real provider wired.
- Full cross-browser (Safari/Firefox) + mobile device QA not run.
- `ARCHITECTURE.md`, `VIDEO_SYSTEM.md`, `MEDIA_GUIDE.md`, `CMS_GUIDE.md`,
  `SECURITY.md`, `DEPLOYMENT.md` from directive §62 not yet written
  (`MOTION_SYSTEM.md` done; `DESIGN_SYSTEM.md`/`DATA_MODEL.md` pre-existing).
