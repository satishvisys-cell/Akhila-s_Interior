---
name: animation-website
description: Build premium cinematic animation-first websites from scratch, including architectural, real-estate, construction, luxury portfolio, interactive storytelling, 4K media, cinematic tours, galleries, project progress, live CCTV, CMS-driven pages, and production-grade responsive frontend systems.
---

# Animation Website Engineering Skill

## PURPOSE

Build premium, cinematic, animation-first websites from scratch.

This skill applies especially to:

- Architecture websites
- Interior design websites
- Construction companies
- Real-estate companies
- Luxury brands
- Premium portfolios
- Creative studios
- Product showcases
- Interactive storytelling websites
- High-end corporate websites

The goal is not merely to make the website functional.

The goal is to create an experience.

Also follow the project always-on rule: `.cursor/rules/premium-animation-website.mdc`.

---

# PHASE 1 — UNDERSTAND THE PROJECT

Before writing code:

1. Inspect the repository.
2. Identify framework.
3. Identify routing.
4. Identify styling system.
5. Identify component architecture.
6. Identify animation libraries.
7. Identify media handling.
8. Identify backend/API architecture.
9. Identify authentication.
10. Identify CMS architecture.
11. Identify existing skills/rules.
12. Identify design references.

Never assume the project structure.

---

# PHASE 2 — ESTABLISH THE DESIGN SYSTEM

Create a centralized design system.

Define:

## Colors

- Background
- Surface
- Surface elevated
- Primary
- Secondary
- Accent
- Text
- Muted text
- Border
- Success
- Warning
- Error

## Typography

Define:

- Display
- H1
- H2
- H3
- H4
- Body
- Small
- Caption
- Label
- Navigation

## Spacing

Use a consistent spacing scale.

## Layout

Define:

- Max content width
- Page gutters
- Grid
- Columns
- Section spacing

## Motion

Define:

- Duration
- Easing
- Delay
- Stagger
- Transition presets

---

# PHASE 3 — BUILD THE VISUAL FOUNDATION

Implement:

- Global background
- Typography
- Containers
- Grid
- Buttons
- Links
- Inputs
- Cards
- Badges
- Dividers
- Navigation
- Footer
- Modal
- Drawer
- Tooltip
- Toast
- Skeletons

Everything must be reusable.

---

# PHASE 4 — BUILD THE HEADER

Header should support:

- Transparent state
- Solid state
- Scroll state
- Mobile navigation
- Active page
- CTA
- Dropdowns
- Project navigation
- Smooth transitions

Desktop and mobile should be intentionally designed separately.

---

# PHASE 5 — BUILD CINEMATIC HERO

Hero may contain:

- Full-screen image
- Full-screen video
- Architectural animation
- Typography
- Project metadata
- CTA
- Scroll indicator

Use:

- viewport-aware sizing
- image positioning
- controlled motion
- text reveal
- cinematic transitions

Do not overload the hero.

The first viewport must immediately communicate the brand.

---

# PHASE 6 — STORYTELLING SECTIONS

Use sections such as:

- Brand statement
- Featured projects
- Architecture philosophy
- Services
- Process
- Materials
- Statistics
- Testimonials
- Journal
- CTA

Sections should have visual rhythm.

Avoid making every section look identical.

---

# PHASE 7 — PROJECT SYSTEM

Create reusable project architecture.

Project:

```text
Project
├── Hero
├── Overview
├── Location
├── Concept
├── Architecture
├── Floor Plans
├── Materials
├── Gallery
├── Video
├── Room Explorer
├── Construction Progress
├── Technical Drawings
├── Timeline
└── Contact CTA
```

Do not turn project pages into simple image grids.

---

# PHASE 8 — CINEMATIC TOURS

For cinematic room tours, use a deliberate sequence.

Example:

```text
01 Entrance
02 Living Room
03 Kitchen
04 Stairs
05 Hall
06 Master Bedroom
07 Bathroom
```

Never skip scenes.

Transitions should feel spatially connected.

Support:

- Scene preload
- Progress indicator
- Keyboard navigation
- Reduced-motion fallback
- Loading / error / offline states

---

# PHASE 9 — INTERACTIVE ARCHITECTURAL EXPERIENCES

Where appropriate support:

- Exploded views
- Layer toggles
- Floor selection
- Room selection
- Material exploration
- Before/after states
- Construction stages
- Scroll-driven storytelling
- 3D/2.5D experiences
- Cinematic camera movement

Exploded / construction sequence example:

```text
Assembled
→ Exploded
→ Construction / Painting
```

Interactions must remain understandable and performant.

Prefer GPU-friendly properties: `transform`, `opacity`, `clip-path`, controlled blur.

---

# PHASE 10 — GALLERY / VIDEO / MEDIA

Build:

- Responsive galleries
- Lightbox / immersive viewer
- Video sections with posters
- Before/after comparators
- Lazy loading
- WebP/AVIF delivery
- Virtualization for large sets

Never load unnecessary 4K assets on mobile.

Never distort images — crop intentionally.

---

# PHASE 11 — CONSTRUCTION PROGRESS + LIVE CCTV

Construction progress:

- Timeline
- Stage media
- Status labels
- CMS-driven updates

Live CCTV:

- Public users see approved/public streams only
- Private streams require auth + authorization
- Never expose RTSP, camera credentials, or private URLs to the browser
- Proxy private streams through authenticated server-side infrastructure

Graceful states:

- Live
- Connecting
- Offline
- Maintenance
- Restricted

---

# PHASE 12 — CMS-DRIVEN PAGES

Prefer:

```text
Database/CMS → API → Typed data → Section renderer → UI
```

Admins should control:

- Hero, images, videos
- Projects, galleries, progress
- Posts, pages, sections
- SEO, CTA, navigation, footer
- Construction updates

Do not require source-code changes for normal content updates.

---

# PHASE 13 — MOTION SYSTEM

Define reusable presets:

- Fade Up
- Fade In
- Reveal
- Scale In
- Image Zoom
- Parallax
- Slide
- Stagger
- Page Transition
- Modal Transition
- Navigation Transition

Use consistent easing and duration.

Respect `prefers-reduced-motion`:

- Remove parallax
- Reduce transition distances
- Disable unnecessary camera movement
- Keep state changes understandable

Do not animate everything.

---

# PHASE 14 — STATES, A11Y, SECURITY, PERFORMANCE

Every major experience needs:

- Loading
- Error
- Empty
- Disabled
- Offline/failure where applicable

Accessibility:

- Keyboard navigation
- Visible focus
- Semantic HTML
- Screen readers
- Contrast
- Labels

Security:

- No secrets in client code
- Server-side authz
- Signed URLs for private media
- Rate limiting, CSP, secure headers

Performance:

- Code splitting / dynamic imports
- Optimized images/video
- Preload only critical assets
- GPU-friendly animation

---

# PHASE 15 — VALIDATION

Before considering work complete:

- Typecheck
- Lint
- Tests where available
- Responsive layouts
- Console errors
- Broken images
- Animation performance
- Keyboard + reduced motion
- Loading/error states
- Auth boundaries
- Mobile behavior

---

# FINAL PRINCIPLE

Build as if reviewed by:

- A world-class architect
- A premium design studio
- A senior frontend engineer
- A motion designer
- A security engineer
- A performance engineer

The result must feel intentional, cinematic, technically excellent, responsive, accessible, secure, and production-ready.
