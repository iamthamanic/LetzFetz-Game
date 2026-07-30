# Effekseer preset effects (`.efkefc`)

Committed Effekseer preset binaries for VFX Studio and Combinate live here.

## Layout

| File | Preset | Category |
|------|--------|----------|
| `aura.efkefc` | Aura (default preview) | aura |
| `trail.efkefc` | Trail | trail |
| `impact.efkefc` | Impact | impact |
| `ambient.efkefc` | Ambient | ambient |

Paths are referenced as `/vfx/effects/<name>.efkefc` from the app (Vite `public/` root).

## Authoring workflow

1. Create or export the preset in **Effekseer Desktop** (parameter presets only — no free graph in V1).
2. Copy the `.efkefc` (and any bundled textures) into this folder.
3. Run `npm run checks` — preview auto-detects via HTTP HEAD and swaps from the particle stand-in to Effekseer WebGL when the file is present.

## Runtime adapter

Browser preview uses `src/features/build/vfx/preview/effekseerAdapter.ts`. When a real runtime is wired, prefer the MIT-licensed [`@zaniar/effekseer-webgl-wasm`](https://www.npmjs.com/package/@zaniar/effekseer-webgl-wasm) package (EffekseerForWebGL) inside that adapter — do not import Effekseer directly from feature UI.

## MVP

No binaries are shipped in this slice. The Aura stand-in renders until `aura.efkefc` is committed.
