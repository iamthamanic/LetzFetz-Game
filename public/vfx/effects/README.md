# Effekseer preset effects (`.efkefc`)

Committed Effekseer preset binaries for VFX Studio and Combinate live here.

## Layout

| File | Preset | Upstream sample (MIT) | Companions |
|------|--------|----------------------|------------|
| `aura.efkefc` | Aura | EffekseerForWebGL `Light.efkefc` | `Parts/` |
| `trail.efkefc` | Trail | `Arrow1.efkefc` | `Texture/` |
| `impact.efkefc` | Impact | `Blow1.efkefc` | `Texture/` |
| `ambient.efkefc` | Ambient | `Cure1.efkefc` | `Texture/` |

Paths are referenced as `/vfx/effects/<name>.efkefc` from the app (Vite `public/` root).

License: see `EFFEKSEER_SAMPLE_LICENSE.txt` (MIT, Effekseer Project).

## Authoring workflow

1. Create or export the preset in **Effekseer Desktop** (parameter presets only — no free graph in V1).
2. Copy the `.efkefc` (and any bundled textures under relative `Parts/` or `Texture/`) into this folder.
3. Run `npm run checks` — preview loads via `effekseerAdapter.ts`.

## Runtime adapter

Browser preview uses `src/features/build/vfx/preview/effekseerAdapter.ts` with
`@zaniar/effekseer-webgl-wasm` (classic script + WASM under `/vfx/effekseer/`).
Do not import Effekseer directly from feature UI.

Design: `.qa/design/effekseer-runtime-wiring.md`.
