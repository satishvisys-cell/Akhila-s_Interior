# Akhila — Design System

Premium cinematic design system for an architectural design & construction platform.

**Brand:** Akhila  
**Positioning:** Luxury architecture studio × premium real-estate presentation × modern construction technology × high-end visual portfolio × live construction monitoring.

**Principles:** Trust · Quality · Precision · Transparency · Premium Craftsmanship

---

## 1. Visual Direction

Cinematic, architectural, editorial, minimal, technically precise.

**Do**
- Large typography, generous whitespace, architectural grids
- 4K photography / visualization as primary storytelling
- Asymmetric editorial layouts
- Subtle, purposeful motion
- Warm architectural neutrals + sparingly used bronze

**Don't**
- Generic SaaS / purple-blue startup aesthetics
- Excessive gradients, glassmorphism, cartoon roundness
- Equal-card grids as default
- Cheap shadows or decorative clutter

---

## 2. Color Tokens

### Primitive

| Token | Hex | Use |
|---|---|---|
| ivory-50 | `#FBF9F6` | Page background |
| ivory-100 | `#F5F1EA` | Soft surface |
| stone-200 | `#E8E2D9` | Borders / dividers |
| sand-300 | `#D4C4B0` | Muted accents |
| bronze-500 | `#9A7B5A` | Primary accent (sparse) |
| bronze-600 | `#7D6347` | Accent hover |
| charcoal-800 | `#2C2A26` | Primary text |
| graphite-900 | `#1A1917` | Display / hero text |
| graphite-950 | `#0F0E0D` | Deep overlays |
| live-500 | `#2F6B4F` | Live status |
| warn-500 | `#B08A3A` | Maintenance |
| error-500 | `#8F3D3D` | Offline / error |
| white | `#FFFFFF` | Elevated surfaces |

### Semantic

| Token | Value |
|---|---|
| background | ivory-50 |
| surface | ivory-100 |
| surface-elevated | white |
| text | charcoal-800 |
| text-muted | `#6B6560` |
| text-inverse | ivory-50 |
| border | stone-200 |
| accent | bronze-500 |
| overlay-hero | graphite-950 @ 35–45% |
| focus-ring | bronze-500 |

---

## 3. Typography

| Role | Family | Notes |
|---|---|---|
| Display / H1–H2 | Newsreader | Editorial, architectural |
| UI / Body / Nav | Manrope | Modern, highly readable |
| Metadata / Labels | Manrope Medium | Tracking +0.04em uppercase sparingly |

Scale (desktop):

| Token | Size / Line | Weight |
|---|---|---|
| display | clamp(48px, 7vw, 88px) / 1.05 | 400–500 |
| h1 | 48–56px / 1.1 | 500 |
| h2 | 36–40px / 1.15 | 500 |
| h3 | 24–28px / 1.25 | 500 |
| body | 16–18px / 1.6 | 400 |
| small | 14px / 1.5 | 400 |
| caption | 12–13px / 1.4 | 500 |
| nav | 13–14px / 1.2 | 500 |

Avoid excessive font weights. Hierarchy via size, spacing, and contrast.

---

## 4. Spacing & Layout

- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Section vertical rhythm: 96–160px desktop, 64–96px mobile
- Container max: 1440px content / 1680px media-wide
- Gutters: 24px mobile · 40px tablet · 64–80px desktop
- Grid: 12-column architectural grid; allow asymmetric spans

Radius: **4px** max for controls; imagery largely square/rect with 0–2px radius. Avoid pill UI.

---

## 5. Motion

Premium, slow, purposeful, subtle.

| Preset | Duration | Easing |
|---|---|---|
| fade-up | 600–900ms | cubic-bezier(0.22, 1, 0.36, 1) |
| reveal | 800–1200ms | same |
| image-zoom | 8–14s (idle) / 400ms hover | ease-out |
| page | 500–700ms | shared |
| stagger | 60–100ms | — |

Respect `prefers-reduced-motion`: no parallax, reduced distances, no camera drift.

---

## 6. Imagery

Treat all media as premium 4K architectural photography / viz.

- Realistic lighting, accurate materials, consistent grading
- Responsive crop (object-fit/cover), never distort
- Hero: full-bleed edge-to-edge
- Lazy-load below fold; optimized delivery (WebP/AVIF); 4K sources ≠ 4K mobile payloads

---

## 7. Components (semantic)

Buttons: primary (bronze fill), secondary (outline charcoal), ghost (text)  
Inputs: understated borders, stone focus, clear error  
Cards: prefer editorial blocks over boxed cards; cards only when interactive  
Badges: LIVE / OFFLINE / MAINTENANCE — minimal, high contrast  
Live indicator: soft green pulse (disabled under reduced motion)  
Navigation: transparent → solid/blur on scroll  
Tour controls: film-like timeline, not carousel chrome  
CCTV: large viewport + strip selector; never show credentials/raw URLs  

States required everywhere: loading, empty, error, disabled, offline.

---

## 8. Accessibility

WCAG-oriented contrast, visible focus, keyboard paths, semantic HTML, ARIA for custom controls, accessible media controls, reduced-motion support.

---

## 9. Brand Voice (UI copy)

Precise, calm, confident. Short sentences. No hype fluff. Prefer craft language: vision, structure, detail, finish, handover.

---

## 10. Screen Families

**Public:** Home, Projects, Project Detail, Master Tour, Room Explorer, Live Sites, Live Site Detail, Gallery, Gallery Detail, Journal, Article, Services, Service Detail, Process, About, Contact  

**Admin:** Login, Dashboard, Projects, Project Editor, Pages, Page Builder, Hero Builder, Master Tour Builder, Room Builder, Gallery, Media Library, Videos, Posts, Live Sites, CCTV Manager, Progress Manager, Users, Roles, Navigation, SEO, Settings, Analytics  

Admin UI: calm charcoal/ivory tool surfaces — still premium architectural, never generic purple SaaS.
