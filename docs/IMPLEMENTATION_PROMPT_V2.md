# Implementation Prompt — Akhila Full Design System → Production Site

Copy everything below the line into a new Cursor agent chat (attach `.agents/skills/animation-website/SKILL.md` and `.cursor/rules/premium-animation-website.mdc`).

---

## ROLE

You are implementing the **complete Akhila Architecture platform** from the approved Stitch v2 designs into the existing Next.js app. Stitch is the **visual source of truth**. Do not invent a generic SaaS look. Port layouts, typography, spacing, imagery treatment, and motion faithfully.

## PRODUCT

Premium cinematic website + admin CMS for an architectural design & construction company:

- Public: projects, Master Tour, Room Explorer, Live CCTV sites, gallery, journal, services, process, about, contact
- Admin: full CMS (pages, heroes, projects, media, CCTV, progress, users/roles, SEO, analytics)

Feel: luxury architecture studio × premium real-estate presentation × construction tech × high-end portfolio × live site monitoring.

Communicate: **TRUST · QUALITY · PRECISION · TRANSPARENCY · PREMIUM CRAFTSMANSHIP**

## DESIGN SOURCE OF TRUTH (in priority order)

1. **Stitch project v2**  
   https://stitch.withgoogle.com/projects/15065125676195745336  
   Project ID: `15065125676195745336`  
   Design system asset: `assets/6474577476777203195` (“Akhila Architectural System v2”)

2. **Local Stitch exports** (use these if browser Stitch looks empty — MCP account may differ from browser Google account):  
   - Previews: `docs/stitch/previews-v2/` (+ `index.html`)  
   - HTML: `docs/stitch/html-v2/`  
   - Catalog: `docs/stitch/SCREEN-CATALOG-V2.md`  
   - Design MD: `docs/stitch/DESIGN_SYSTEM_V2.md`

3. **Repo design docs**  
   `docs/design/DESIGN.md`, `TOKENS.md`, `MOTION.md`, `ACCESSIBILITY.md`, `PRINCIPLES.md`  
   `docs/PAGE_MAP.md`, `docs/COMPONENT_MAP.md`, `docs/IMPLEMENTATION_PLAN.md`

4. **Skills / rules (mandatory)**  
   - `.agents/skills/animation-website/SKILL.md`  
   - `.cursor/rules/premium-animation-website.mdc`

## EXISTING CODEBASE

- App root: `web/` (Next.js App Router, React 19, Tailwind v4, TypeScript)
- Public routes: `web/src/app/(public)/`
- Admin: `web/src/app/admin/`
- Components: `web/src/components/`
- CMS/auth: `web/src/lib/cms/`, `web/src/lib/auth/`, `web/src/domain/`
- Partial v2 ports already exist: Home, Header (glass), Footer, Projects grid, Contact — **extend and align**, do not rewrite from scratch unless fidelity requires it

Dev server typically: `http://localhost:3000` · Admin: `/admin` (seed: see project docs; rotate credentials)

## VISUAL SYSTEM (lock these)

| Token | Value |
|---|---|
| Ivory bg | `#FBF9F6` |
| Surface | `#F5F1EA` |
| Stone | `#E8E2D9` |
| Sand | `#D4C4B0` |
| Bronze | `#9A7B5A` (accent, sparingly) |
| Bronze hover | `#7D6347` |
| Charcoal | `#2C2A26` |
| Graphite | `#1A1917` |
| Live hot | `#C23B3B` |
| Display font | Newsreader |
| UI font | Manrope |
| Radius | max **4px** (ROUND_FOUR) |
| Motion | fade-up ~800ms, image zoom **1.03**, stagger ~70ms, ease `cubic-bezier(0.22, 1, 0.36, 1)` |

**Do:** editorial asymmetric grids, large typography, cinematic imagery, generous whitespace, subtle glass **header only**, image-first cards, GPU-friendly motion (`transform` / `opacity`).

**Don’t:** purple/blue SaaS gradients, heavy glassmorphism on cards, cartoon roundness, equal-card grids as default, cheap multi-shadows, generic dashboards on public pages, Inter/Roboto/Arial as primary fonts.

Respect `prefers-reduced-motion` everywhere.

## STITCH SCREENS TO IMPLEMENT (complete ecosystem)

### Public
1. Home — cinematic hero, metrics, Selected Works, Expertise, Live teaser, footer  
2. Projects index — asymmetric editorial grid, filters, LIVE badge  
3. Project Detail — hero, overview, stats, concept, story, Master Tour CTA, rooms, before/during/after, exploded diagrams, materials, progress, CCTV teaser, gallery, videos, updates, timeline, location, contact CTA  
4. Master Tour — Entrance → Living → Kitchen → Stairs → Hall → Bedroom → Bathroom (film UI: timeline, thumbs, play/pause, progress, fullscreen, mute)  
5. Room Explorer — Assembled / Exploded / Painted / Final; VISION→STRUCTURE→DETAIL→FINISH→FINAL  
6. Live Sites listing  
7. Live Site Detail — primary viewport + camera thumbs, LIVE/OFFLINE/MAINTENANCE, fullscreen/mute/snapshot UI (**no credentials / no raw RTSP / no private URLs in client**)  
8. Gallery (+ detail / lightbox)  
9. Journal (+ article)  
10. Services (+ service detail)  
11. Process — 01 Consultation … 08 Handover  
12. About  
13. Contact — lead form + Direct Lines  

### Global chrome
- Sticky header: transparent/glass over hero → solid/blur on scroll; nav + “Start a Project”; excellent mobile menu  
- Premium charcoal footer: nav, legal, newsletter if in Stitch  

### Admin CMS (architectural admin, not purple SaaS)
Login, Dashboard, Projects, Project Editor, Pages, Page Builder, Hero Builder, Master Tour Builder, Room Builder, Gallery, Media Library, Videos, Posts, Live Sites, CCTV Manager, Progress Manager, Users, Roles, Navigation, SEO, Settings, Analytics  

Admin must drive public content: CMS → API → typed data → section renderer → UI.

## ARCHITECTURE REQUIREMENTS

```text
Page → Sections → Section Type → Section Data → Reusable Renderer
```

Reuse/extend: Hero, ProjectGrid, ProjectCard, Gallery, VideoSection, TourViewer, RoomExplorer, ExplodedDiagram, ProgressTimeline, CCTVViewer, JournalGrid, ContactSection, etc.

Prefer CMS-driven content; avoid hardcoding that blocks admin edits for normal marketing updates.

## SECURITY (non-negotiable)

- Never expose API secrets, DB credentials, CCTV/RTSP credentials, private camera URLs, admin tokens in client code or public API responses  
- Private streams: authenticated **server-side** proxy/session only  
- RBAC on admin mutations; HttpOnly secure session cookies  
- Validate uploads (MIME/magic bytes), rate limit sensitive endpoints  
- See `docs/SECURITY_MODEL.md`, `docs/SECURITY_AUDIT.md`

## MEDIA / PERFORMANCE

- Treat source assets as 4K-quality architectural photography; **deliver** responsive derivatives (thumb / mobile / tablet / desktop) — do not ship full 4K to mobile by default  
- Lazy load, WebP/AVIF where appropriate, code-split heavy experiences (tour, CCTV, 3D)  
- Intentional cropping; never distort images  

## MOTION SYSTEM

Implement reusable presets: Fade Up, Fade In, Reveal, Scale In, Image Zoom, Parallax (subtle), Slide, Stagger, Page / Modal / Nav transitions.  
Slow, premium, purposeful — never excessive.

## ACCESSIBILITY

WCAG-minded: keyboard nav, visible focus, semantic HTML, labels, contrast, accessible video/tour controls, reduced motion.

## EVERY MAJOR EXPERIENCE MUST HAVE

Loading · Error · Empty · Disabled · Offline/failure where applicable.

## IMPLEMENTATION ORDER (execute autonomously — do not wait for “continue”)

### Phase A — Foundation
1. Inspect repo + Stitch HTML/previews; sync tokens in CSS/Tailwind to DESIGN_SYSTEM_V2  
2. Lock header/footer/chrome to Stitch  
3. Confirm fonts (Newsreader + Manrope) and motion utilities  

### Phase B — Public storytelling
4. Home fidelity pass vs `01-home` HTML/preview  
5. Projects index vs `02-projects`  
6. Project Detail full section stack  
7. Master Tour + Room Explorer  
8. Live Sites + Live Site Detail (UI complete; stream playback may be session-gated stub if proxy incomplete — document honestly)  
9. Gallery, Journal, Services, Process, About, Contact  

### Phase C — Admin visual fidelity
10. Align admin shell + key builders (Page, Hero, Project, Media, CCTV) to Stitch admin screens without breaking existing APIs/RBAC  

### Phase D — Wire CMS ↔ public
11. Published content from CMS drives heroes, projects, gallery, posts, progress, public cameras  
12. Draft/scheduled/publish gates  

### Phase E — QA & docs
13. Typecheck, lint, relevant tests  
14. Responsive + keyboard + reduced-motion checks  
15. Update `docs/stitch/SCREEN-CATALOG-V2.md`, `docs/STATUS.md`, implementation notes  
16. Do **not** claim VERIFIED_PRODUCTION without evidence  

## SUCCESS CRITERIA

- [ ] Every public route matches Stitch layout/hierarchy/imagery treatment (not a structural shell)  
- [ ] Admin remains functional and visually aligned  
- [ ] No CCTV secrets/private URLs in client  
- [ ] Motion system consistent; reduced-motion works  
- [ ] Mobile nav, tour fullscreen, gallery swipe-ready, CCTV single-camera mobile layout  
- [ ] Honest status of any incomplete backend (e.g. live stream decode)  

## CONSTRAINTS

- Prefer extending existing architecture over rewrites  
- No commits unless I explicitly ask  
- No fake “done”: IMPLEMENTED ≠ VERIFIED  
- If Stitch UI is empty in browser, use local `docs/stitch/previews-v2` + `html-v2` + MCP `get_screen` / `list_screens`  

## START NOW

1. Diff current `web/` public pages against Stitch v2 HTML/previews.  
2. Produce a short gap list.  
3. Immediately begin Phase A → B and implement page-by-page until the full public ecosystem matches Stitch, then admin fidelity, then CMS wiring and QA.
