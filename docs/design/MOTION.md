# Motion

Premium, slow, purposeful, subtle.

## Principles
- Motion communicates hierarchy, space, and progress — not decoration.
- Prefer `transform`, `opacity`, `clip-path`.
- Respect `prefers-reduced-motion` (no parallax / camera drift).

## Presets
| Name | Duration | Notes |
|---|---|---|
| fade-up | 600–900ms | section entrances |
| reveal | 800–1200ms | image/mask reveals |
| stagger | 60–100ms | lists / metrics |
| image-zoom | 400ms hover | editorial media |
| page | 500–700ms | route transitions |
| tour-crossfade | 800–1400ms | Master Tour scenes |
| live-pulse | 1.6s loop | LIVE badge only |

Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
