# Subagent Prompt — Stitch-Faithful Port (FIX)

Copy everything below into a Cursor **frontend-engineer** (or generalPurpose) agent.

---

## MISSION

You failed before by building “inspired by” shells. Fix that.

**Stitch is the ONLY visual source of truth.** Implement the Next.js public site so each route **matches** the corresponding Stitch screen HTML + screenshot — layout, typography, spacing, imagery, hierarchy, chrome. Not approximate. Not “close enough.”

Stitch project (PRIVATE — use MCP + local exports if browser empty):
https://stitch.withgoogle.com/projects/15065125676195745336  
ID: `15065125676195745336`  
DS: `assets/6474577476777203195`

## BEFORE WRITING CODE

1. Call `user-stitch` `list_screens` + `get_screen` for each screen ID below; download **fresh** HTML + JPG into:
   - `docs/stitch/html-v2/`
   - `docs/stitch/previews-v2/`
2. **Read the full HTML** for the screen you are porting (not summaries).
3. **Open/read the JPG preview** with the Read tool (vision) and note structure.
4. Diff against current `web/src/app/(public)/**` — if it doesn’t match Stitch structure, **rewrite the page**, don’t patch cosmetics.

## CANONICAL SCREENS (prefer these IDs)

| Route | Stitch screen ID | Title |
|---|---|---|
| `/` | `2622f593989b4cc993561bb2d9d7a42d` | Premium Editorial Homepage |
| `/projects` | `89652f17a20048eaaa739a53f509577e` | Selected Works |
| `/projects/[slug]` | `2b41879c708e42afbf1627151fb1a32a` | Casa Horizon - Project Detail (or `86f505162ca0484a836dc7e64cfc560c` Meridian) |
| `/projects/[slug]/tour` | `695cc639bfb9491c9bb1e8c900891db9` | Master Tour Cinematic |
| `/projects/[slug]/rooms` | `7e302c69e6364c8da7bb4f3b1d3565d2` | Room Explorer |
| `/live-sites` | `4d174c4921b14adf921a9b293fee4c19` | Live Sites |
| `/live-sites/[slug]` | `6f3a1e814dbd4e9dbd259fe0d785f94e` | Live Site Detail |
| `/gallery` | `71316cd5497d46afbdd58aacacd5d57a` | Visual Archive |
| `/journal` | `75a8b20c1e9e4a8bb93b7437df5c0df6` | Journal Editorial |
| `/contact` | `2fe942f81ced418989da9e48868a3494` | Contact |

Also sync header/footer from homepage HTML (glass sticky nav, charcoal footer).

Local copies may already exist under `docs/stitch/html-v2/` and `previews-v2/` — **re-download if older than Stitch `updateTime`**.

## APP STACK

- Root: `/Users/visys-mac2/Desktop/Projects/Akhila's_Interior/web`
- Next.js App Router, React 19, Tailwind v4, TypeScript
- Fonts: Newsreader + Manrope already in `app/layout.tsx`
- Tokens: `src/styles/tokens.css` (ivory `#FBF9F6`, bronze `#9A7B5A`, charcoal `#2C2A26`)
- Dev: `http://localhost:3000` (restart if needed)
- CMS data: `web/data/cms/` — wire real project/media when present; **visual structure must still match Stitch** when CMS empty (use Stitch image URLs from HTML)

## HOW TO PORT (mandatory method)

For each screen:

1. Extract from Stitch HTML:
   - Section order
   - Exact headlines / labels / CTAs
   - Grid proportions (asymmetric spans)
   - Image URLs (`lh3.googleusercontent.com/...`)
   - Spacing rhythm (py-24/32, max-w-7xl, etc.)
2. Implement as React/TSX + Tailwind classes that **mirror** the Stitch markup structure.
3. Replace `#` links with real Next routes.
4. Client interactivity only where Stitch UI requires it (tour play, room state tabs, camera switcher) — keep behavior matching the design chrome.
5. Respect `prefers-reduced-motion`.
6. **Never** invent purple SaaS cards, generic `PageHero` shells, or equal card grids when Stitch shows asymmetric editorial layouts.

## SUCCESS CRITERIA (agent must verify)

- [ ] Side-by-side: Stitch JPG vs running page for Home, Projects, Project Detail, Tour, Rooms, Live Sites, Live Detail, Gallery, Journal, Contact — structure matches
- [ ] Header glass + scroll behavior matches homepage Stitch
- [ ] Images from Stitch HTML load (next.config already allows `lh3.googleusercontent.com`)
- [ ] `npx tsc --noEmit` clean
- [ ] Update `docs/stitch/SCREEN-CATALOG-V2.md` with screen IDs used + “ported fidelity: YES/NO” per route
- [ ] Honest note if any section could not match (missing HTML)

## CONSTRAINTS

- Do not claim “done” without reading Stitch HTML + comparing to preview JPG
- Do not invent admin screens this pass unless HTML exists
- No commits unless user asks
- No CCTV credentials / RTSP in client
- Prefer rewriting page files over leaving shell layouts

## START ORDER

1. Refresh HTML/JPG from Stitch MCP for the 10 routes above  
2. Port Home + Header/Footer from `2622f593…` HTML **faithfully**  
3. Projects → Project Detail → Tour → Rooms → Live → Gallery → Journal → Contact  
4. Typecheck + write fidelity checklist in SCREEN-CATALOG-V2.md  

BEGIN NOW. Do not ask for approval between pages.
