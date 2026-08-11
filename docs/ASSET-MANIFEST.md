# LOL Asset Manifest

Generated / organized for the premium homepage redesign.

## Brand
| File | Purpose | Format | Generated | Replaceable |
|------|---------|--------|-----------|-------------|
| `/public/assets/brand/LOL-logo.svg` | Primary logo | SVG | yes | yes |
| `/public/assets/brand/LOL-logo-dark.svg` | Footer / dark bg | SVG | yes | yes |
| `/public/assets/brand/LOL-mark.svg` | Compact mark | SVG | yes | yes |
| `/public/assets/brand/LOL-favicon.svg` | Favicon | SVG | yes | yes |

## Hero
| File | Purpose | Format | Notes |
|------|---------|--------|-------|
| `/public/assets/hero/hero-poster.svg` | WebGL fallback / loading poster | SVG | PLACEHOLDER — replace with editorial WebP photo when available |

## 3D
| Asset | Purpose | Status |
|-------|---------|--------|
| Procedural R3F character in `HeroCrochetCanvas.tsx` | Hero crochet object | **Implemented procedurally** (no external copyrighted GLB) |
| `/public/assets/3d/hero-character.glb` | Optional future GLB | **PLACEHOLDER** — use authorized product scan / artist GLB |
| `/public/assets/3d/crochet-hook.glb` | Optional hook GLB | **PLACEHOLDER** — currently procedural mesh |
| `/public/assets/3d/yarn-strand.glb` | Optional yarn | **PLACEHOLDER** — procedural cylinder + controller |
| `src/lib/3d/crochet-stitch-system.ts` | Progress → stitch mapping | Implemented |

Original red/blue superhero-inspired amigurumi is **procedural**, not a scraped Spider-Man asset.

## Products
Existing seed placeholders under `/public/placeholders/*.svg` remain the product images until real photography is uploaded via admin.

## Categories
Category cards currently use existing `/public/placeholders/*` product-style SVGs mapped to Toys, Bags, Accessories, Home, Apparel.

## Icons
React stroke icons in `src/components/icons.tsx` (1.6px system).

## Social
Real testimonials from DB only — no invented customer photos.
