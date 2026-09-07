# Design System — Akhila (implementation contract)

**Source of truth:** Stitch design system `assets/5743265162187991775` + approved screens.  
**Code home (target):** `src/styles/tokens.css`, `src/components/ui/*`, `src/components/layout/*`

This document is the engineering mirror of Stitch. Do not invent alternate aesthetics.

---

## Principles

- Cinematic, architectural, editorial, minimal
- Bronze accent sparingly
- Radius capped at **4px** (imagery often 0–2px)
- Editorial blocks over boxed cards
- Motion: slow, purposeful; respect `prefers-reduced-motion`

---

## Color tokens

### Primitive
| Token | Hex |
|---|---|
| `--color-ivory-50` | `#FBF9F6` |
| `--color-ivory-100` | `#F5F1EA` |
| `--color-stone-200` | `#E8E2D9` |
| `--color-sand-300` | `#D4C4B0` |
| `--color-bronze-500` | `#9A7B5A` |
| `--color-bronze-600` | `#7D6347` |
| `--color-charcoal-800` | `#2C2A26` |
| `--color-graphite-900` | `#1A1917` |
| `--color-graphite-950` | `#0F0E0D` |
| `--color-live-500` | `#2F6B4F` |
| `--color-live-hot` | `#C23B3B` (LIVE badge in Stitch CCTV HUD) |
| `--color-warn-500` | `#B08A3A` |
| `--color-error-500` | `#8F3D3D` |
| `--color-white` | `#FFFFFF` |

### Semantic
| Token | Maps to |
|---|---|
| `--bg` | ivory-50 |
| `--surface` | ivory-100 |
| `--elevated` | white |
| `--text` | charcoal-800 |
| `--text-muted` | `#6B6560` |
| `--text-inverse` | ivory-50 |
| `--border` | stone-200 |
| `--accent` | bronze-500 |
| `--accent-hover` | bronze-600 |
| `--focus` | bronze-500 |
| `--overlay-hero` | graphite-950 @ 40% |
| `--admin-sidebar` | graphite-900 |
| `--status-live` | live-hot / live-500 (context) |
| `--status-offline` | muted stone/charcoal |
| `--status-maintenance` | warn-500 |

---

## Typography

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / H1–H2 | Newsreader | 400–500 | Editorial |
| H3–H4 | Newsreader | 400–500 | |
| Body / UI | Manrope | 400–500 | |
| Nav / Label | Manrope | 500 | Often uppercase + tracking |
| Metadata | Manrope | 500 | Small caps / tracking |

### Scale (CSS clamp targets)
| Token | Desktop | Mobile |
|---|---|---|
| `--text-display` | clamp(48px, 7vw, 88px) / 1.05 | ~40px |
| `--text-h1` | 48–56px / 1.1 | 32–40px |
| `--text-h2` | 36–40px / 1.15 | 28–32px |
| `--text-h3` | 24–28px / 1.25 | 22px |
| `--text-body` | 16–18px / 1.6 | 16px |
| `--text-small` | 14px / 1.5 | 14px |
| `--text-caption` | 12–13px / 1.4 | 12px |
| `--text-nav` | 13–14px / 1.2 | 14px |

---

## Spacing & layout

| Token | Value |
|---|---|
| `--space-1` … `--space-32` | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 |
| `--section-y` | 96–160px desktop / 64–96 mobile |
| `--container` | 1440px |
| `--container-wide` | 1680px |
| `--gutter` | 24 / 40 / 64–80 by breakpoint |
| `--radius-sm` | 2px |
| `--radius-md` | 4px |
| `--radius-full` | **forbidden** for primary UI |

Grid: 12 columns; asymmetric editorial spans allowed.

---

## Breakpoints

| Name | Min width |
|---|---|
| `sm` | 640 |
| `md` | 768 |
| `lg` | 1024 |
| `xl` | 1280 |
| `2xl` | 1440 |
| `3xl` | 1680 |

---

## Motion

| Preset | Duration | Easing |
|---|---|---|
| fade-up | 600–900ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| reveal | 800–1200ms | same |
| hover-zoom | 400ms | ease-out |
| page | 500–700ms | same |
| stagger | 60–100ms | — |
| live-pulse | 1.6s | ease-in-out |

Reduced motion: remove parallax, long zooms, continuous pulses; keep opacity fades ≤200ms.

---

## Component primitives (required)

Typography · Colors (via tokens) · Spacing · Container · Grid · Button · Link · Card (editorial) · Badge · Input · Select · Textarea · Checkbox · Tabs · Modal · Drawer · Tooltip · Toast · Skeleton · Loading · Empty · Error · Breadcrumb · Pagination · Progress · Timeline · ImageViewer · VideoPlayer · GalleryControls · LiveIndicator · Divider · Icon

### Button variants (Stitch)
- **Primary:** bronze fill / inverse text
- **Secondary:** charcoal outline
- **Ghost:** text / transparent (hero overlay uses light ghost)
- **Inverse:** on dark charcoal sections
- States: hover, focus-visible, active, disabled, loading

### Badge / LiveIndicator
- LIVE (hot red or green per context — CCTV HUD uses hot LIVE)
- OFFLINE
- MAINTENANCE
- Never color-only — include text

---

## Elevation

Prefer tonal layers + 1px stone borders. Soft ambient shadows only when Stitch shows them. No multi-layer glow.

---

## Accessibility

- Visible focus ring (`--focus`)
- Contrast AA for text/controls
- Keyboard for all interactive surfaces
- Semantic landmarks
- Reduced motion support
