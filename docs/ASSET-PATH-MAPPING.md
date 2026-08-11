# Asset path mapping (Sprint 0)

Source folder: `C:\P\lol\assets`  
Served statically as: `/assets/...` via `C:\P\lol\public\assets`

## Found in source (2026-08-11)

| Source file | Mapped public URL | Role |
|-------------|-------------------|------|
| `Gemini_Generated_Image_e3dm9ee3dm9ee3dm.png` | `/assets/hero/hero-workspace-background.png` | Hero / editorial background |
| `Gemini_Generated_Image_thtcqcthtcqcthtc.png` | `/assets/hero/hero-character-lifestyle.png` | Character + hook lifestyle hero |
| `Gemini_Generated_Image_6ughgk6ughgk6ugh.png` | `/assets/hero/hero-character-isolated.png` | Isolated hanging character (poster / fallback) |
| `Gemini_Generated_Image_4ts0jc4ts0jc4ts0.png` | `/assets/hero/crochet-hook-product.png` | Hook product / process visual |
| `Gemini_Generated_Image_9hecvm9hecvm9hec.png` | `/assets/textures/yarn-ball-red.png` | Yarn texture / brand still |
| `Gemini_Generated_Image_3xx71k3xx71k3xx7.png` | `/assets/textures/crochet-swatches-sheet.png` | Crochet material swatches |

Originals also copied to `/assets/reference/` for audit.

## 3D (Sprint 2)

| File | URL | Status |
|------|-----|--------|
| `hero-character.glb` | `/assets/3d/hero-character.glb` | Generated original crochet character (~150KB) |
| `crochet-hook.glb` | `/assets/3d/crochet-hook.glb` | Generated pink-handle hook (~26KB) |

Source mirrored at `C:\P\lol\assets\3d\` and `C:\P\lol\public\assets\3d\`.
Regenerate with: `node scripts/generate-hero-glbs.mjs`

## Hero polish (Sprint 4 / PHASE 17)

| File | URL | Role |
|------|-----|------|
| `hero-background.webp` | `/assets/hero/hero-background.webp` | Desktop DOF photo bg |
| `hero-background-mobile.webp` | `/assets/hero/hero-background-mobile.webp` | Mobile crop |
| `hero-fallback.webp` | `/assets/hero/hero-fallback.webp` | WebGL-off poster |
| `hero-annotations.png` | `/assets/hero/hero-annotations.png` | Annotation style reference |



## Code references

Prefer these URLs in components:

```ts
"/assets/hero/hero-character-lifestyle.png"
"/assets/hero/hero-character-isolated.png"
"/assets/hero/hero-workspace-background.png"
"/assets/hero/crochet-hook-product.png"
"/assets/textures/yarn-ball-red.png"
"/assets/textures/crochet-swatches-sheet.png"
"/assets/3d/hero-character.glb" // when available
```

## Sprint workflow (confirmed)

1. You send a **Sprint N** prompt from the Complete Plan  
2. I implement only that sprint  
3. I reply with **what changed** + **how to test**  
4. You verify → then send Sprint N+1  
