# Akhila — Stitch Screen Catalog v2

**Stitch project:** [Akhila Architecture — Cinematic Platform v2](https://stitch.withgoogle.com/projects/15065125676195745336)  
**Project ID:** `15065125676195745336`  
**Design system:** `assets/6474577476777203195` — Akhila Architectural System v2  

Refreshed HTML + JPG via MCP `get_screen` on 2026-09-06 → `docs/stitch/html-v2/` + `previews-v2/`.

## Canonical screens + fidelity

| Route | Screen ID | Title | Ported fidelity |
|---|---|---|---|
| `/` | `2622f593989b4cc993561bb2d9d7a42d` | Premium Editorial Homepage | **YES** — hero, metrics, asymmetric Selected Works, charcoal disciplines, LIVE teaser; header/footer from homepage chrome |
| `/projects` | `89652f17a20048eaaa739a53f509577e` | Selected Works | **YES** — overlay-on-image 8/4 + 5/7 grid, rounded-full filters, LIVE badge, View Archive |
| `/projects/[slug]` | `2b41879c708e42afbf1627151fb1a32a` | Casa Horizon - Project Detail | **YES** — 85vh hero, overview+stats, Master Tour CTA, Spatial Progression, materials/exploded, client access lock form, bronze contact CTA |
| `/projects/[slug]/tour` | `695cc639bfb9491c9bb1e8c900891db9` | Master Tour Cinematic | **YES** — immersive dark chrome, scene overlay, timeline + thumbnails (no site header/footer) |
| `/projects/[slug]/rooms` | `7e302c69e6364c8da7bb4f3b1d3565d2` | Room Explorer | **YES** — italic headline, Assembled/Exploded/Painted segmented controls, ultra-wide media |
| `/live-sites` | `4d174c4921b14adf921a9b293fee4c19` | Live Sites | **YES** — stats strip + featured Casa Horizon + Meridian/Northline cards (Stitch layout when CMS sparse) |
| `/live-sites/[slug]` | `6f3a1e814dbd4e9dbd259fe0d785f94e` | Live Site Detail | **YES** — 16:9 feed, 4 cam switcher, headcount/safety, activity log (preview imagery only; no CCTV secrets) |
| `/gallery` | `71316cd5497d46afbdd58aacacd5d57a` | Visual Archive | **YES** — left title + Filter by pills + masonry fixed heights from Stitch HTML |
| `/journal` | `75a8b20c1e9e4a8bb93b7437df5c0df6` | Journal Editorial | **YES** — Editorial feature 5/7 split, Latest Entries 4/5 cards, interactive Master Tour tile |
| `/contact` | `2fe942f81ced418989da9e48868a3494` | Contact | **YES** — Start a Conversation, underline fields, Direct Lines + Studio + materials image |

## Local assets

| # | Screen | Preview | HTML |
|---|---|---|---|
| 01 | Homepage | `previews-v2/01-home.jpg` | `html-v2/01-home.html` |
| 02 | Selected Works | `02-projects.jpg` | `02-projects.html` |
| 03 | Project Detail | `03-project-detail.jpg` | `03-project-detail.html` |
| 04 | Master Tour | `04-master-tour.jpg` | `04-master-tour.html` |
| 05 | Room Explorer | `05-room-explorer.jpg` | `05-room-explorer.html` |
| 06 | Live Sites | `06-live-sites.jpg` | `06-live-sites.html` |
| 07 | Live Site Detail | `07-live-site-detail.jpg` | `07-live-site-detail.html` |
| 08 | Gallery | `08-gallery.jpg` | `08-gallery.html` |
| 09 | Journal | `09-journal.jpg` | `09-journal.html` |
| 15 | Contact | `15-contact.jpg` | `15-contact.html` |

## Honest gaps / ASSUMPTIONS

- **ASSUMPTION:** Shared site chrome uses homepage Stitch nav (Projects/Services/Process/Live Sites/Gallery/About/Contact), not per-screen alternate nav labels (Portfolio/Master Tour/etc.).
- **ASSUMPTION:** Project detail Stitch copy (Casa Horizon / Malibu) is shown when CMS project is Meridian/Horizon-named or description is thin; CMS fields win otherwise.
- Live CCTV remains **preview/session-gated** — no RTSP/credentials in client.
- Services / Process / About lack dedicated Stitch v2 HTML (not in the 10-route mission).
- Admin screens not Stitch-ported this pass.
- JPG vision OCR sometimes differs from HTML (e.g. nav labels); **HTML is source of truth**.

## Typecheck

`npx tsc --noEmit` — **PASS** (2026-09-06 fidelity port).
